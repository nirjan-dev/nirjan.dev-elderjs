<script lang="ts">
  import isEmail from 'validator/lib/isEmail';
  import Spinner from './spinner.svelte';

  let contactForm = {
    name: '',
    email: '',
    description: '',
  };

  let errors = {
    name: null,
    email: null,
    description: null,
  };

  let formState: 'UNSENT' | 'SENDING' | 'SENT' = 'UNSENT';

  const validateForm = () => {
    // reset form errors and validate again

    errors.name = errors.description = errors.email = null;

    if (contactForm.name.length === 0) {
      errors.name = 'Name is required';
    }
    if (contactForm.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    if (!isEmail(contactForm.email)) {
      errors.email = 'Email is not valid';
    }
    // elderjs needs an LHS assignment for reactivity to work
    errors = { ...errors };
    if (contactForm.name.length < 5 || contactForm.description.length < 10 || !isEmail(contactForm.email)) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    formState = 'SENDING';
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeForm({
        'form-name': 'contact',
        ...contactForm,
      }),
    })
      .then(() => {
        formState = 'SENT';
        alert('Success!');
      })
      .catch((error) => {
        console.error(error);
        alert('Sending message failed, Please try again');
        formState = 'UNSENT';
      });
  };

  function encodeForm(data) {
    return Object.keys(data)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  }
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

  .form-status {
    &__msg {
      text-align: center;
      font-weight: bold;
      font-size: 130%;
      color: var(--primary);
      margin: 2rem 0 4rem;
    }
    &__img {
      max-width: 80%;
      display: block;
      margin: 0 auto;
      max-height: 25vh;
    }
  }

  .form {
    margin-top: 2rem;
    &__group {
      position: relative;
      margin: var(--spacing-2) 0;
    }
    &__error-msg {
      color: tomato;
      min-height: 1.2rem;
      margin: 0;
    }
    &__field {
      background: 0 0;
      border: none;
      border-bottom-color: currentcolor;
      border-bottom-style: none;
      border-bottom-width: medium;
      border-radius: 0;
      border-bottom: 2px solid var(--primary-light);
      display: block;
      width: 100%;
      padding: var(--spacing-0);
      &:focus,
      &:active {
        border: none;
        border-bottom-color: currentcolor;
        border-bottom-style: none;
        border-bottom-width: medium;
        border-bottom: 2px solid var(--primary);
        background: var(--light);
      }
    }
    &__label {
      display: block;
      font-weight: lighter;
      color: #666;
      position: absolute;
      top: 0;
      opacity: 0;
      transition: 0.3s opacity ease-out, 0.3s transform cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    &__field:focus + label,
    &__field:active + label {
      transform: translateY(-30px);
      opacity: 1;
    }
    &__field {
      &.with-min-height {
        min-height: 10rem;
      }
    }
    &__action-btn {
      background: var(--secondary);
      border: none;
      padding: var(--spacing-0) var(--spacing-1);
      color: var(--light);
      border-radius: 5px;
      box-shadow: 0px 4px 3px 0px rgba(50, 50, 50, 0.2);
      opacity: 0.9;
      transition: all 200ms cubic-bezier(0.08, 0.82, 0.17, 1);
      display: inline-block;
      cursor: pointer;
      &:hover,
      &:active,
      &:focus {
        box-shadow: 0px 5px 3px 0px rgba(50, 50, 50, 0.3);
        opacity: 1;
        transform: scale(1.025);
        color: var(--light);
      }
    }
  }
</style>

<div class="grid-wrapper">
  <section class="form-status grid-wrapper__item" class:is-invisible={formState !== 'SENT'}>
    <p class="form-status__msg">✔ Message Sent successfully....</p>
    <img class="form-status__img" src="/img/mail_sent.svg" alt="" />
  </section>
  <section class="form-status grid-wrapper__item" class:is-invisible={formState !== 'SENDING'}>
    <p class="form-status__msg">Sending message....</p>
    <Spinner />
  </section>
  <form
    class:is-invisible={formState !== 'UNSENT'}
    class="form grid-wrapper__item"
    name="contact"
    action="/contact"
    method="post"
    data-netlify="true"
    data-netlify-honeypot="bot-field"
    on:submit|preventDefault={handleSubmit}>
    <input type="hidden" name="form-name" value="contact" />
    <div hidden><label> Don’t fill this out: <input name="bot-field" /> </label></div>
    <div class="form__group">
      <input
        class="form__field"
        placeholder="Your Name"
        bind:value={contactForm.name}
        name="name"
        type="text"
        id="name" />
      <label class="form__label" for="name">Name</label>
      {#if errors.name}
        <p class="form__error-msg">{errors.name}</p>
      {/if}
    </div>
    <div class="form__group">
      <input
        class="form__field"
        placeholder="Your Email"
        bind:value={contactForm.email}
        name="email"
        type="text"
        id="email" />
      <label class="form__label" for="email">Email</label>
      {#if errors.email}
        <p class="form__error-msg">{errors.email}</p>
      {/if}
    </div>
    <div class="form__group">
      <textarea
        class="form__field with-min-height"
        bind:value={contactForm.description}
        name="description"
        id="description"
        placeholder="Project Description" />
      <label class="form__label" for="description">Description</label>
      {#if errors.description}
        <p class="form__error-msg">{errors.description}</p>
      {/if}
    </div>
    <div class="form__group"><button class="form__action-btn" type="submit">Send</button></div>
  </form>
</div>
