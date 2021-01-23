<script>
  export let question = 'Enter your name';
  export let answers;
  export let correct;

  $: parsedAnswers = answers ? JSON.parse(answers) : '';

  let showAnswer = false;
  let isCorrect = false;
</script>

<!-- your code here -->
<svelte:options tag={'nk-quiz'} />
<div>
  <h1>{question}</h1>

  {#each parsedAnswers as answer}
    <li>
      <button
        on:click={(answer) => {
          if (answer.title === correct) {
            isCorrect = true;
          } else {
            isCorrect = false;
          }
          showAnswer = true;
        }}>{answer.title}</button>
    </li>
  {/each}
  <ul />

  {#if showAnswer}
    <div>
      <p>{isCorrect ? 'correct!!!' : 'incoreect!!!'}</p>
      <p>Answer: {correct}</p>
    </div>
  {/if}
</div>
