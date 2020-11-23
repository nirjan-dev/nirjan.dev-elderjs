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
    console.log("validated")

    if (contactForm.name.length < 5) {
      errors.name = 'Name must be at  least 5 characters';
    }
    if (contactForm.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    if (!isEmail(contactForm.email)) {
      errors.email = 'Email is not valid';
    }
    if (contactForm.name.length < 5 || contactForm.description.length < 10 || !isEmail(contactForm.email)) {
      return false;
    } else {
      return true;
    }
  }

  const handleSubmit = () => {

    console.log('handle submit called')
    console.log({errors});


    if (!validateForm()) {
      console.log({errors});
      return;
    }
    formState = 'SENDING';
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
    //   });
  }

  function encodeForm(data) {
    return Object.keys(data)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  }


</script>

{#if formState === 'SENT'}
  <section class="status-screen">
    <p class="msg">✔ Message Sent successfully....</p>
  </section>
{:else if formState === 'SENDING'}
  <section class="status-screen">
    <p class="msg">Sending message....</p>
    <!-- <Loading /> -->
  </section>
{:else }
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
