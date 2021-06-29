function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function attribute_to_object(attributes) {
    const result = {};
    for (const attribute of attributes) {
        result[attribute.name] = attribute.value;
    }
    return result;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function tick() {
    schedule_update();
    return resolved_promise;
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
let SvelteElement;
if (typeof HTMLElement === 'function') {
    SvelteElement = class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            // @ts-ignore todo: improve typings
            for (const key in this.$$.slotted) {
                // @ts-ignore todo: improve typings
                this.appendChild(this.$$.slotted[key]);
            }
        }
        attributeChangedCallback(attr, _oldValue, newValue) {
            this[attr] = newValue;
        }
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            // TODO should this delegate to addEventListener?
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    };
}

/* src/Quiz.svelte generated by Svelte v3.32.3 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	child_ctx[7] = list;
	child_ctx[8] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	child_ctx[11] = i;
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	child_ctx[11] = i;
	return child_ctx;
}

// (378:6) {#if question.snippet}
function create_if_block_4(ctx) {
	let div;
	let pre;
	let code;
	let t_value = /*question*/ ctx[6].snippet.code + "";
	let t;
	let code_class_value;
	let pre_class_value;

	return {
		c() {
			div = element("div");
			pre = element("pre");
			code = element("code");
			t = text(t_value);
			attr(code, "class", code_class_value = "language-" + /*question*/ ctx[6].snippetLanguage + " quiz-code-block ");
			attr(pre, "class", pre_class_value = "language-" + /*question*/ ctx[6].snippetLanguage);
			attr(div, "class", "code-toolbar");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, pre);
			append(pre, code);
			append(code, t);
		},
		p(ctx, dirty) {
			if (dirty & /*questions*/ 1 && t_value !== (t_value = /*question*/ ctx[6].snippet.code + "")) set_data(t, t_value);

			if (dirty & /*questions*/ 1 && code_class_value !== (code_class_value = "language-" + /*question*/ ctx[6].snippetLanguage + " quiz-code-block ")) {
				attr(code, "class", code_class_value);
			}

			if (dirty & /*questions*/ 1 && pre_class_value !== (pre_class_value = "language-" + /*question*/ ctx[6].snippetLanguage)) {
				attr(pre, "class", pre_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (408:14) {:else}
function create_else_block_1(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.innerHTML = `<i class="gg-close"></i>`;
			attr(span, "class", "quiz__answer-icon");
			attr(span, "aria-label", "incorrect");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) detach(span);
		}
	};
}

// (406:14) {#if question.correctIndex === answerIndex}
function create_if_block_3(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.innerHTML = `<i class="gg-check"></i>`;
			attr(span, "class", "quiz__answer-icon");
			attr(span, "aria-label", "correct");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) detach(span);
		}
	};
}

// (390:8) {#each question.answers as answer, answerIndex}
function create_each_block_2(ctx) {
	let div;
	let input;
	let input_class_value;
	let input_value_value;
	let t0;
	let label;
	let t1_value = /*answer*/ ctx[9].label + "";
	let t1;
	let t2;
	let div_class_value;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[2](/*question*/ ctx[6], /*each_value*/ ctx[7], /*questionIndex*/ ctx[8]);
	}

	function select_block_type(ctx, dirty) {
		if (/*question*/ ctx[6].correctIndex === /*answerIndex*/ ctx[11]) return create_if_block_3;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div = element("div");
			input = element("input");
			t0 = space();
			label = element("label");
			t1 = text(t1_value);
			t2 = space();
			if_block.c();

			attr(input, "class", input_class_value = "quiz__answer-option " + `quiz__answer-option--${/*question*/ ctx[6].correctIndex === /*answerIndex*/ ctx[11]
			? "correct"
			: "incorrect"}`);

			attr(input, "type", "radio");
			input.value = input_value_value = /*answer*/ ctx[9].label;
			attr(input, "id", `answer-${/*questionIndex*/ ctx[8]}-${/*answerIndex*/ ctx[11]}`);
			attr(input, "name", `answer-${/*questionIndex*/ ctx[8]}`);
			attr(label, "for", `answer-${/*questionIndex*/ ctx[8]}-${/*answerIndex*/ ctx[11]}`);

			attr(div, "class", div_class_value = "quiz__answer--multiple quiz__answer " + (/*question*/ ctx[6].answered
			? "quiz__answer--answered"
			: ""));
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, input);
			append(div, t0);
			append(div, label);
			append(label, t1);
			append(label, t2);
			if_block.m(label, null);

			if (!mounted) {
				dispose = listen(input, "click", click_handler);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*questions*/ 1 && input_class_value !== (input_class_value = "quiz__answer-option " + `quiz__answer-option--${/*question*/ ctx[6].correctIndex === /*answerIndex*/ ctx[11]
			? "correct"
			: "incorrect"}`)) {
				attr(input, "class", input_class_value);
			}

			if (dirty & /*questions*/ 1 && input_value_value !== (input_value_value = /*answer*/ ctx[9].label)) {
				input.value = input_value_value;
			}

			if (dirty & /*questions*/ 1 && t1_value !== (t1_value = /*answer*/ ctx[9].label + "")) set_data(t1, t1_value);

			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(label, null);
				}
			}

			if (dirty & /*questions*/ 1 && div_class_value !== (div_class_value = "quiz__answer--multiple quiz__answer " + (/*question*/ ctx[6].answered
			? "quiz__answer--answered"
			: ""))) {
				attr(div, "class", div_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			if_block.d();
			mounted = false;
			dispose();
		}
	};
}

// (439:14) {:else}
function create_else_block(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.innerHTML = `<i class="gg-close"></i>`;
			attr(span, "class", "quiz__answer-icon");
			attr(span, "aria-label", "incorrect");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) detach(span);
		}
	};
}

// (437:14) {#if question.correctIndex === answerIndex}
function create_if_block_2(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.innerHTML = `<i class="gg-check"></i>`;
			attr(span, "class", "quiz__answer-icon");
			attr(span, "aria-label", "correct");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) detach(span);
		}
	};
}

// (413:8) {#each question.richAnswers as answer, answerIndex}
function create_each_block_1(ctx) {
	let div1;
	let input;
	let input_class_value;
	let t0;
	let label;
	let div0;
	let pre;
	let code;
	let t1_value = /*answer*/ ctx[9].label + "";
	let t1;
	let code_class_value;
	let pre_class_value;
	let t2;
	let div1_class_value;
	let mounted;
	let dispose;

	function click_handler_1() {
		return /*click_handler_1*/ ctx[3](/*question*/ ctx[6], /*each_value*/ ctx[7], /*questionIndex*/ ctx[8]);
	}

	function select_block_type_1(ctx, dirty) {
		if (/*question*/ ctx[6].correctIndex === /*answerIndex*/ ctx[11]) return create_if_block_2;
		return create_else_block;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div1 = element("div");
			input = element("input");
			t0 = space();
			label = element("label");
			div0 = element("div");
			pre = element("pre");
			code = element("code");
			t1 = text(t1_value);
			t2 = space();
			if_block.c();

			attr(input, "class", input_class_value = "quiz__answer-option " + `quiz__answer-option--${/*question*/ ctx[6].correctIndex === /*answerIndex*/ ctx[11]
			? "correct"
			: "incorrect"}`);

			attr(input, "type", "radio");
			input.value = /*answerIndex*/ ctx[11];
			attr(input, "id", `answer-${/*questionIndex*/ ctx[8]}-${/*answerIndex*/ ctx[11]}`);
			attr(input, "name", `answer-${/*questionIndex*/ ctx[8]}`);
			attr(code, "class", code_class_value = "language-" + /*question*/ ctx[6].language + " quiz-code-block ");
			attr(pre, "class", pre_class_value = "language-" + /*question*/ ctx[6].language);
			attr(div0, "class", "code-toolbar");
			attr(label, "for", `answer-${/*questionIndex*/ ctx[8]}-${/*answerIndex*/ ctx[11]}`);

			attr(div1, "class", div1_class_value = "quiz__answer--multiple quiz__answer quiz__answer--rich " + (/*question*/ ctx[6].answered
			? "quiz__answer--answered"
			: ""));
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, input);
			append(div1, t0);
			append(div1, label);
			append(label, div0);
			append(div0, pre);
			append(pre, code);
			append(code, t1);
			append(label, t2);
			if_block.m(label, null);

			if (!mounted) {
				dispose = listen(input, "click", click_handler_1);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*questions*/ 1 && input_class_value !== (input_class_value = "quiz__answer-option " + `quiz__answer-option--${/*question*/ ctx[6].correctIndex === /*answerIndex*/ ctx[11]
			? "correct"
			: "incorrect"}`)) {
				attr(input, "class", input_class_value);
			}

			if (dirty & /*questions*/ 1 && t1_value !== (t1_value = /*answer*/ ctx[9].label + "")) set_data(t1, t1_value);

			if (dirty & /*questions*/ 1 && code_class_value !== (code_class_value = "language-" + /*question*/ ctx[6].language + " quiz-code-block ")) {
				attr(code, "class", code_class_value);
			}

			if (dirty & /*questions*/ 1 && pre_class_value !== (pre_class_value = "language-" + /*question*/ ctx[6].language)) {
				attr(pre, "class", pre_class_value);
			}

			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(label, null);
				}
			}

			if (dirty & /*questions*/ 1 && div1_class_value !== (div1_class_value = "quiz__answer--multiple quiz__answer quiz__answer--rich " + (/*question*/ ctx[6].answered
			? "quiz__answer--answered"
			: ""))) {
				attr(div1, "class", div1_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div1);
			if_block.d();
			mounted = false;
			dispose();
		}
	};
}

// (444:8) {#if question.answer}
function create_if_block(ctx) {
	let div;
	let input;
	let t0;
	let label;
	let t2;
	let button;
	let t4;
	let if_block_anchor;
	let mounted;
	let dispose;

	function input_input_handler() {
		/*input_input_handler*/ ctx[4].call(input, /*each_value*/ ctx[7], /*questionIndex*/ ctx[8]);
	}

	function click_handler_2() {
		return /*click_handler_2*/ ctx[5](/*question*/ ctx[6], /*each_value*/ ctx[7], /*questionIndex*/ ctx[8]);
	}

	let if_block = /*question*/ ctx[6].answered && create_if_block_1(ctx);

	return {
		c() {
			div = element("div");
			input = element("input");
			t0 = space();
			label = element("label");
			label.textContent = "Answer field";
			t2 = space();
			button = element("button");
			button.textContent = "Check answer";
			t4 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(input, "id", `single-answer-${/*questionIndex*/ ctx[8]}`);
			attr(input, "type", "text");
			attr(label, "for", `single-answer-${/*questionIndex*/ ctx[8]}`);
			attr(label, "class", "hidden");
			attr(button, "type", "button");
			attr(div, "class", "quiz__answer quiz__answer--single");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, input);
			set_input_value(input, /*question*/ ctx[6].textAnswer);
			append(div, t0);
			append(div, label);
			append(div, t2);
			append(div, button);
			insert(target, t4, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(input, "input", input_input_handler),
					listen(button, "click", click_handler_2)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*questions*/ 1 && input.value !== /*question*/ ctx[6].textAnswer) {
				set_input_value(input, /*question*/ ctx[6].textAnswer);
			}

			if (/*question*/ ctx[6].answered) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			if (detaching) detach(t4);
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (455:10) {#if question.answered}
function create_if_block_1(ctx) {
	let p;
	let t_value = /*question*/ ctx[6].answer + "";
	let t;

	return {
		c() {
			p = element("p");
			t = text(t_value);
			attr(p, "class", "quiz__corect-answer");
		},
		m(target, anchor) {
			insert(target, p, anchor);
			append(p, t);
		},
		p(ctx, dirty) {
			if (dirty & /*questions*/ 1 && t_value !== (t_value = /*question*/ ctx[6].answer + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(p);
		}
	};
}

// (373:2) {#each questions as question, questionIndex}
function create_each_block(ctx) {
	let div1;
	let h3;
	let t0_value = /*question*/ ctx[6].text + "";
	let t0;
	let t1;
	let t2;
	let div0;
	let t3;
	let t4;
	let t5;
	let if_block0 = /*question*/ ctx[6].snippet && create_if_block_4(ctx);
	let each_value_2 = /*question*/ ctx[6].answers;
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	let each_value_1 = /*question*/ ctx[6].richAnswers;
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let if_block1 = /*question*/ ctx[6].answer && create_if_block(ctx);

	return {
		c() {
			div1 = element("div");
			h3 = element("h3");
			t0 = text(t0_value);
			t1 = space();
			if (if_block0) if_block0.c();
			t2 = space();
			div0 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t3 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t4 = space();
			if (if_block1) if_block1.c();
			t5 = space();
			attr(h3, "class", "quiz__question");
			attr(div0, "class", "quiz__answers");
			attr(div1, "class", "quiz__question-block");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, h3);
			append(h3, t0);
			append(div1, t1);
			if (if_block0) if_block0.m(div1, null);
			append(div1, t2);
			append(div1, div0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(div0, null);
			}

			append(div0, t3);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div0, null);
			}

			append(div0, t4);
			if (if_block1) if_block1.m(div0, null);
			append(div1, t5);
		},
		p(ctx, dirty) {
			if (dirty & /*questions*/ 1 && t0_value !== (t0_value = /*question*/ ctx[6].text + "")) set_data(t0, t0_value);

			if (/*question*/ ctx[6].snippet) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_4(ctx);
					if_block0.c();
					if_block0.m(div1, t2);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty & /*questions*/ 1) {
				each_value_2 = /*question*/ ctx[6].answers;
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_2(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(div0, t3);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_2.length;
			}

			if (dirty & /*questions*/ 1) {
				each_value_1 = /*question*/ ctx[6].richAnswers;
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, t4);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}

			if (/*question*/ ctx[6].answer) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block(ctx);
					if_block1.c();
					if_block1.m(div0, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		d(detaching) {
			if (detaching) detach(div1);
			if (if_block0) if_block0.d();
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			if (if_block1) if_block1.d();
		}
	};
}

function create_fragment(ctx) {
	let form;
	let each_value = /*questions*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			form = element("form");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.c = noop;
			attr(form, "class", "quiz");
		},
		m(target, anchor) {
			insert(target, form, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(form, null);
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*questions*/ 1) {
				each_value = /*questions*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(form, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(form);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let questions;
	let { options } = $$props;

	onMount(() => {
		tick().then(() => {
			const codeBlocks = document.querySelector("nk-quiz").shadowRoot.querySelectorAll(".quiz-code-block");

			codeBlocks.forEach(block => {
				Prism.highlightElement(block);
			});
		});
	});

	const click_handler = (question, each_value, questionIndex) => {
		$$invalidate(0, each_value[questionIndex].answered = true, questions);
	};

	const click_handler_1 = (question, each_value, questionIndex) => {
		$$invalidate(0, each_value[questionIndex].answered = true, questions);
	};

	function input_input_handler(each_value, questionIndex) {
		each_value[questionIndex].textAnswer = this.value;
		($$invalidate(0, questions), $$invalidate(1, options));
	}

	const click_handler_2 = (question, each_value, questionIndex) => {
		$$invalidate(0, each_value[questionIndex].answered = true, questions);
	};

	$$self.$$set = $$props => {
		if ("options" in $$props) $$invalidate(1, options = $$props.options);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*options*/ 2) {
			$$invalidate(0, questions = Array.from(JSON.parse(options).questions));
		}
	};

	return [
		questions,
		options,
		click_handler,
		click_handler_1,
		input_input_handler,
		click_handler_2
	];
}

class Quiz extends SvelteElement {
	constructor(options) {
		super();
		this.shadowRoot.innerHTML = `<style>@charset "UTF-8";code[class*='language-'],pre[class*='language-']{color:#ccc;background:none;font-family:Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*='language-']{padding:1em;margin:0.5em 0;overflow:auto}:not(pre)>code[class*='language-'],pre[class*='language-']{background:#2d2d2d}:not(pre)>code[class*='language-']{padding:0.1em;border-radius:0.3em;white-space:normal}.token.comment,.token.block-comment,.token.prolog,.token.doctype,.token.cdata{color:#999}.token.punctuation{color:#ccc}.token.tag,.token.attr-name,.token.namespace,.token.deleted{color:#e2777a}.token.function-name{color:#6196cc}.token.boolean,.token.number,.token.function{color:#f08d49}.token.property,.token.class-name,.token.constant,.token.symbol{color:#f8c555}.token.selector,.token.important,.token.atrule,.token.keyword,.token.builtin{color:#cc99cd}.token.string,.token.char,.token.attr-value,.token.regex,.token.variable{color:#7ec699}.token.operator,.token.entity,.token.url{color:#67cdcc}.token.important,.token.bold{font-weight:bold}.token.italic{font-style:italic}.token.entity{cursor:help}.token.inserted{color:green}.line-highlight{position:absolute;left:0;right:0;padding:inherit 0;margin-top:1em;background:rgba(153, 122, 102, 0.08);background:linear-gradient(to right, rgba(153, 122, 102, 0.1) 70%, rgba(153, 122, 102, 0));pointer-events:none;line-height:inherit;white-space:pre}@media print{.line-highlight{-webkit-print-color-adjust:exact;color-adjust:exact}}.line-highlight:before{content:attr(data-start);position:absolute;top:0.4em;left:0.6em;min-width:1em;padding:0 0.5em;background-color:rgba(153, 122, 102, 0.4);color:#f5f2f0;font:bold 65%/1.5 sans-serif;text-align:center;vertical-align:0.3em;border-radius:999px;text-shadow:none;box-shadow:0 1px white}.line-numbers .line-highlight:before,.line-numbers .line-highlight:after{content:none}pre[class*='language-'].line-numbers{position:relative;padding-left:3.8em;counter-reset:linenumber}pre[class*='language-'].line-numbers>code{position:relative;white-space:inherit}.line-numbers .line-numbers-rows{position:absolute;pointer-events:none;top:0;font-size:100%;left:-3.8em;width:3em;letter-spacing:-1px;border-right:1px solid #999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}pre{padding:var(--spacing-1);border-radius:10px;overflow:auto}.code-toolbar{width:100%}.hidden{opacity:0;font-size:0.1px;position:absolute}.quiz{width:100%}.quiz__question{font-size:var(--font-size-2)}.quiz__question-block{width:100%}.quiz__question-block *+*{margin-top:var(--spacing-1)}.quiz__answer--multiple{position:relative}.quiz__answer--multiple label{border:1px solid var(--light-purple);padding:var(--spacing-0) var(--spacing-1);cursor:pointer;width:100%;display:flex;justify-content:space-between;align-items:center;border-radius:var(--border-radius-normal);transition:background-color 0.2s linear;box-sizing:border-box;border:2px solid currentColor}.quiz__answer--multiple label:hover,.quiz__answer--multiple label:focus{background-color:var(--lightest)}.quiz__answer--multiple label .quiz__answer-icon{display:none;margin-left:var(--spacing-0)}.quiz__answer--multiple input{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0}.quiz__answer--multiple input:checked+label{color:var(--lightest)}@media(prefers-color-scheme: dark){.quiz__answer--multiple input:checked+label{color:var(--darkest)}}.quiz__answer--multiple input:checked+label .quiz__answer-icon{display:initial}.quiz__answer-option--correct:checked+label{background-color:var(--success)}.quiz__answer-option--incorrect:checked+label{background-color:var(--danger)}.quiz__answer--answered .quiz__answer-option--correct+label{background-color:var(--success);color:var(--lightest)}@media(prefers-color-scheme: dark){.quiz__answer--answered .quiz__answer-option--correct+label{color:var(--darkest)}}.quiz__answer--answered .quiz__answer-option--correct+label .quiz__answer-icon{display:initial}.quiz__answer *+*{margin-top:var(--spacing-0)}.quiz__answer--single{display:flex;align-items:stretch}.quiz__answer--single input{flex:1;padding:var(--spacing-0)}.quiz__answer--single button{display:block;background:var(--primary-dark);color:var(--lightest);padding:var(--spacing-0);margin:0;border:none;border-radius:0 var(--border-radius-normal) var(--border-radius-normal) 0;cursor:pointer;opacity:0.8;transition:opacity linear 0.2s}@media(prefers-color-scheme: dark){.quiz__answer--single button{color:var(--darkest)}}.quiz__corect-answer{background:var(--secondary);color:var(--lightest);padding:var(--spacing-0);border-radius:var(--border-radius-normal)}@media(prefers-color-scheme: dark){.quiz__corect-answer{color:var(--darkest)}}.gg-check{box-sizing:border-box;position:relative;display:block;transform:scale(var(--ggs, 1));width:22px;height:22px;border:2px solid transparent;border-radius:100px}.gg-check:after{content:'';display:block;box-sizing:border-box;position:absolute;left:3px;top:-1px;width:6px;height:10px;border-width:0 2px 2px 0;border-style:solid;transform-origin:bottom left;transform:rotate(45deg)}.gg-close{box-sizing:border-box;position:relative;display:block;transform:scale(var(--ggs, 1));width:22px;height:22px;border:2px solid transparent;border-radius:40px}.gg-close:after,.gg-close:before{content:'';display:block;box-sizing:border-box;position:absolute;width:16px;height:2px;background:currentColor;transform:rotate(45deg);border-radius:5px;top:8px;left:1px}.gg-close:after{transform:rotate(-45deg)}</style>`;

		init(
			this,
			{
				target: this.shadowRoot,
				props: attribute_to_object(this.attributes)
			},
			instance,
			create_fragment,
			safe_not_equal,
			{ options: 1 }
		);

		if (options) {
			if (options.target) {
				insert(options.target, this, options.anchor);
			}

			if (options.props) {
				this.$set(options.props);
				flush();
			}
		}
	}

	static get observedAttributes() {
		return ["options"];
	}

	get options() {
		return this.$$.ctx[1];
	}

	set options(options) {
		this.$set({ options });
		flush();
	}
}

customElements.define("nk-quiz", Quiz);

export default Quiz;
