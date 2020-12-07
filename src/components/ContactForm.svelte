<script>
  import isEmail from 'validator/lib/isEmail';

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

  let formState = 'UNSENT';

  const validateForm = () => {
    // reset form errors and validate again

    errors.name = errors.description = errors.email = null;
    console.log('validated');

    if (contactForm.name.length === 0) {
      errors.name = 'Name is required';
    }
    if (contactForm.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    if (!isEmail(contactForm.email)) {
      errors.email = 'Email is not valid';
    }
    // svelte needs an LHS assignment for reactivity to work
    errors = { ...errors };
    if (contactForm.name.length < 5 || contactForm.description.length < 10 || !isEmail(contactForm.email)) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = () => {

    if (!validateForm()) {
      console.log({ errors });
      return;
    }
    // formState = 'SENDING';
    // fetch('/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: encodeForm({
    //     'form-name': 'contact',
    //     ...contactForm,
    //   }),
    // })
    //   .then(() => {
    //     formState = 'SENT';
    //     alert('Success!');
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   })

    
  };

  function encodeForm(data) {
    return Object.keys(data)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  }
</script>

<style lang="scss">
  .msg {
    text-align: center;
    font-weight: bold;
    font-size: 130%;
    color: var(--primary);
    margin: 2rem 0 4rem;
  }

  .form {
    margin-top: 2rem;
    .form-group {
      position: relative;
      margin: 1.5rem 0;
    }
    .error-msg {
      color: tomato;
      min-height: 1.2rem;
      margin: 0;
    }
    input,
    textarea {
      background: 0 0;
      border: none;
      border-bottom-color: currentcolor;
      border-bottom-style: none;
      border-bottom-width: medium;
      border-radius: 0;
      border-bottom: 2px solid var(--primary-light);
      margin-bottom: 1em;
      display: block;
      width: 100%;
      padding: 1rem 1rem;
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
    label {
      display: block;
      font-weight: lighter;
      color: #666;
      position: absolute;
      top: 0;
      opacity: 0;
      transition: 0.3s opacity ease-out, 0.3s transform cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    textarea:focus + label,
    textarea:active + label,
    input:focus + label,
    input:active + label {
      transform: translateY(-25px);
      opacity: 1;
    }
    textarea {
      min-height: 10rem;
    }
    .send-btn {
      background: var(--secondary);
      border: none;
      padding: 0.8rem 1.5rem;
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

{#if formState === 'SENT'}
  <section class="status-screen">
    <p class="msg">✔ Message Sent successfully....</p>
  </section>
{:else if formState === 'SENDING'}
  <section class="status-screen">
    <p class="msg">Sending message....</p>
    <!-- <Loading /> -->
  </section>
{:else}
  <form
  class="form"
  name="contact"
  action="/contact"
  method="post"
  data-netlify="true"
  data-netlify-honeypot="bot-field"
  on:submit|preventDefault={handleSubmit}>
  <input type="hidden" name="form-name" value="contact" />
  <div hidden><label> Don’t fill this out: <input name="bot-field" /> </label></div>
  <div class="form-group">
    <input placeholder="Your Name" bind:value={contactForm.name} name="name" type="text" id="name" />
    <label for="name">Name</label>
    {#if errors.name}
        <p class="error-msg">{errors.name}</p>
    {/if}
  </div>
  <div class="form-group">
    <input placeholder="Your Email" bind:value={contactForm.email} name="email" type="text" id="email" />
    <label for="email">Email</label>
    {#if errors.email}
        <p class="error-msg">{errors.email}</p>
    {/if}
  </div>
  <div class="form-group">
    <textarea
      bind:value={contactForm.description}
      name="description"
      id="description"
      placeholder="Project Description" />
    <label for="description">Description</label>
    {#if errors.description}
        <p class="error-msg">{errors.description}</p>
    {/if}
  </div>
  <div class="form-group"><button class="send-btn" type="submit">Send</button></div>
  </form>
{/if}
