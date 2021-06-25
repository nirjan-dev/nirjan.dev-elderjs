<script lang="ts">
  import isEmail from 'validator/lib/isEmail';
  import Spinner from './spinner.svelte';

  let contactForm = {
    name: '',
    email: '',
  };

  let errors = {
    name: null,
    email: null,
  };

  let formState: 'UNSENT' | 'SENDING' | 'SENT' = 'UNSENT';

  const validateForm = () => {
    // reset form errors and validate again

    errors.name = errors.email = null;

    if (contactForm.name.length === 0) {
      errors.name = 'Name is required';
    }

    if (!isEmail(contactForm.email)) {
      errors.email = 'Email is not valid';
    }
    // elderjs needs an LHS assignment for reactivity to work
    errors = { ...errors };
    if (contactForm.name.length < 0 || !isEmail(contactForm.email)) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = () => {
    const windowObj: any = window;
    if (windowObj && windowObj.panelbear) {
      windowObj.panelbear('track', 'newsletterClick');
    }
    if (!validateForm()) {
      return;
    }
    formState = 'SENDING';
    fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'form-name': 'contact',
        ...contactForm,
      }),
    })
      .then((res) => {
        console.log({ res });
        if (!res || res.status !== 200) {
          throw new Error('form submission api error');
        }
        formState = 'SENT';
        if (windowObj && windowObj.panelbear) {
          windowObj.panelbear('track', 'newsletterSuccess');
        }
      })
      .catch((error) => {
        console.error(error);
        if (windowObj && windowObj.panelbear) {
          windowObj.panelbear('track', 'newsletterFail');
        }
        alert('Sending message failed, Please try again');

        formState = 'UNSENT';
      });
  };
</script>

<style lang="scss">
  .is-invisible {
    visibility: hidden;
  }
  // used to avoid layout shift
  .grid-wrapper {
    display: grid;
    &__item {
      grid-column: 1 / -1;
      grid-row: 1 / -1;
    }
  }
  .newsletter-info {
    margin-bottom: var(--spacing-1);
  }

  .form-status {
    &__msg {
      font-weight: bold;
      font-size: 130%;
      color: var(--primary);

      @media (prefers-color-scheme: dark) {
        color: var(--primary-dark);
      }
    }
    &__img {
      max-width: 80%;
      display: block;
      margin: 0 auto;
      max-height: 25vh;
    }
  }

  .form {
    display: grid;
    grid-template-columns: 2fr 3fr 1fr;
    gap: var(--spacing-0);
    align-items: end;
    align-self: start;

    @media only screen and (max-width: 560px) {
      grid-template-columns: 1fr;
    }

    &__group {
      position: relative;
    }
    &__error-msg {
      color: var(--danger);
      min-height: 1.2rem;
      margin: 0;
    }
    &__field {
      outline: none;
      border: 2px solid var(--primary);
      border-radius: var(--border-radius-normal);
      display: block;
      width: 100%;
      padding: var(--spacing-0);

      @media (prefers-color-scheme: dark) {
        background-color: var(--lighter);
        color: var(--darkest);
        border-color: var(--dark);
      }

      &:focus,
      &:active {
        outline: none;
        border-color: var(--primary-darker);
        border-width: 3px;
        background: var(--lighter);

        @media (prefers-color-scheme: dark) {
          border-color: var(--primary-dark);
          background: var(--lightest);
        }
      }

      &.has-error {
        border-color: var(--danger);
      }
    }
    &__label {
      display: block;
    }
    &__field {
      &.with-min-height {
        min-height: 10rem;
      }
    }
    &__action-btn {
      background: var(--secondary-dark);
      border: none;
      padding: var(--spacing-0) var(--spacing-1);
      color: var(--lightest);
      border-radius: 5px;
      box-shadow: var(--box-shadow-DEFAULT);
      transition: transform 200ms cubic-bezier(0.08, 0.82, 0.17, 1), box-shadow linear 150ms;
      display: inline-block;
      cursor: pointer;
      &:hover,
      &:active {
        box-shadow: var(--box-shadow-lg);
        transform: scale(1.025) translateY(-2px);
        color: var(--lightest);
      }
    }
  }
</style>

<section class="newsletter" aria-label="Newsletter Sign up">
  <p class="newsletter-info">
    Sign up to my newsletter to get helpful content for front-end web devs. No spam, unsubscribe at any time.
  </p>

  <div class="grid-wrapper">
    <section class="form-status grid-wrapper__item" class:is-invisible={formState !== 'SENT'}>
      <p class="form-status__msg">✔ Thanks for Subscribing</p>
    </section>
    <section class="form-status grid-wrapper__item" class:is-invisible={formState !== 'SENDING'}>
      <p class="form-status__msg">Subscribing....</p>
      <Spinner />
    </section>
    <form
      class:is-invisible={formState !== 'UNSENT'}
      class="form grid-wrapper__item"
      name="contact"
      action="/api/newsletter"
      method="post"
      on:submit|preventDefault={handleSubmit}>
      <div class="form__group">
        <label class="form__label" for="name">First Name</label>
        {#if errors.name}
          <p class="form__error-msg">{errors.name}</p>
        {/if}
        <input
          class="form__field"
          class:has-error={errors.name}
          bind:value={contactForm.name}
          name="name"
          type="text"
          id="name" />
      </div>
      <div class="form__group">
        <label class="form__label" for="email">Email</label>
        {#if errors.email}
          <p class="form__error-msg">{errors.email}</p>
        {/if}
        <input
          class="form__field"
          class:has-error={errors.email}
          bind:value={contactForm.email}
          name="email"
          type="text"
          id="email" />
      </div>

      <div class="form__group"><button class="form__action-btn" type="submit">Send</button></div>
    </form>
  </div>
</section>
