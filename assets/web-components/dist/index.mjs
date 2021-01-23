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
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
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
    const prop_values = options.props || {};
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
        ? instance(component, prop_values, (i, ret, ...rest) => {
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

/* src/Quiz.svelte generated by Svelte v3.31.2 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	return child_ctx;
}

// (17:2) {#each parsedAnswers as answer}
function create_each_block(ctx) {
	let li;
	let button;
	let t_value = /*answer*/ ctx[7].title + "";
	let t;
	let mounted;
	let dispose;

	return {
		c() {
			li = element("li");
			button = element("button");
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, li, anchor);
			append(li, button);
			append(button, t);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler*/ ctx[6]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*parsedAnswers*/ 16 && t_value !== (t_value = /*answer*/ ctx[7].title + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(li);
			mounted = false;
			dispose();
		}
	};
}

// (32:2) {#if showAnswer}
function create_if_block(ctx) {
	let div;
	let p0;
	let t0_value = (/*isCorrect*/ ctx[3] ? "correct!!!" : "incoreect!!!") + "";
	let t0;
	let t1;
	let p1;
	let t2;
	let t3;

	return {
		c() {
			div = element("div");
			p0 = element("p");
			t0 = text(t0_value);
			t1 = space();
			p1 = element("p");
			t2 = text("Answer: ");
			t3 = text(/*correct*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, p0);
			append(p0, t0);
			append(div, t1);
			append(div, p1);
			append(p1, t2);
			append(p1, t3);
		},
		p(ctx, dirty) {
			if (dirty & /*isCorrect*/ 8 && t0_value !== (t0_value = (/*isCorrect*/ ctx[3] ? "correct!!!" : "incoreect!!!") + "")) set_data(t0, t0_value);
			if (dirty & /*correct*/ 2) set_data(t3, /*correct*/ ctx[1]);
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function create_fragment(ctx) {
	let div;
	let h1;
	let t0;
	let t1;
	let t2;
	let ul;
	let t3;
	let each_value = /*parsedAnswers*/ ctx[4];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	let if_block = /*showAnswer*/ ctx[2] && create_if_block(ctx);

	return {
		c() {
			div = element("div");
			h1 = element("h1");
			t0 = text(/*question*/ ctx[0]);
			t1 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			ul = element("ul");
			t3 = space();
			if (if_block) if_block.c();
			this.c = noop;
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, h1);
			append(h1, t0);
			append(div, t1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			append(div, t2);
			append(div, ul);
			append(div, t3);
			if (if_block) if_block.m(div, null);
		},
		p(ctx, [dirty]) {
			if (dirty & /*question*/ 1) set_data(t0, /*question*/ ctx[0]);

			if (dirty & /*correct, isCorrect, showAnswer, parsedAnswers*/ 30) {
				each_value = /*parsedAnswers*/ ctx[4];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, t2);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (/*showAnswer*/ ctx[2]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
			if (if_block) if_block.d();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let parsedAnswers;
	let { question = "Enter your name" } = $$props;
	let { answers } = $$props;
	let { correct } = $$props;
	let showAnswer = false;
	let isCorrect = false;

	const click_handler = answer => {
		if (answer.title === correct) {
			$$invalidate(3, isCorrect = true);
		} else {
			$$invalidate(3, isCorrect = false);
		}

		$$invalidate(2, showAnswer = true);
	};

	$$self.$$set = $$props => {
		if ("question" in $$props) $$invalidate(0, question = $$props.question);
		if ("answers" in $$props) $$invalidate(5, answers = $$props.answers);
		if ("correct" in $$props) $$invalidate(1, correct = $$props.correct);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*answers*/ 32) {
			 $$invalidate(4, parsedAnswers = answers ? JSON.parse(answers) : "");
		}
	};

	return [
		question,
		correct,
		showAnswer,
		isCorrect,
		parsedAnswers,
		answers,
		click_handler
	];
}

class Quiz extends SvelteElement {
	constructor(options) {
		super();

		init(
			this,
			{
				target: this.shadowRoot,
				props: attribute_to_object(this.attributes)
			},
			instance,
			create_fragment,
			safe_not_equal,
			{ question: 0, answers: 5, correct: 1 }
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
		return ["question", "answers", "correct"];
	}

	get question() {
		return this.$$.ctx[0];
	}

	set question(question) {
		this.$set({ question });
		flush();
	}

	get answers() {
		return this.$$.ctx[5];
	}

	set answers(answers) {
		this.$set({ answers });
		flush();
	}

	get correct() {
		return this.$$.ctx[1];
	}

	set correct(correct) {
		this.$set({ correct });
		flush();
	}
}

customElements.define("nk-quiz", Quiz);

export { Quiz };
