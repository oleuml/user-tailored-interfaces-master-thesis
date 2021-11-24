<script>
  import Page from '$lib/components/survey/Page.svelte';

  let pages = [
    [
      {
        id: 0,
        question: 'Wie viele Autos möchtest du haben?',
        questionPrefix: 'Frage 1: ',
        type: 'likert',
        answers: ['0', '1', '2', '3', '4'],
        legendType: 'bottom'
      },
      {
        id: 1,
        question: 'Wie schön ist das Wetter heute?',
        questionPrefix: 'Frage 2: ',
        type: 'likert',
        answers: ['sehr schlecht', '1', '2', '3', 'sehr gut'],
        legendType: 'start-end'
      },
      {
        id: 2,
        question: 'Wie viele Häuser möchtest du haben?',
        questionPrefix: 'Frage 3: ',
        type: 'likert',
        answers: ['0', '1', '2', '3', '4'],
        legendType: 'top'
      },
      {
        id: 3,
        question: ['Gebe an welchen Buchstaben du lieber magst.', ['a', 'b', 'c']],
        questionPrefix: 'Frage 4: ',
        type: 'group-likert',
        answers: [
          ['0', '1', '2', '3', '4'],
          ['0', '1', '2', '3', '4'],
          ['0', '1', '2', '3', '4']
        ],
        legendType: 'top'
      }
    ],
    [
      {
        id: 4,
        question: 'Test Frage Hase 1, 2, 3?',
        questionPrefix: 'Frage 5: ',
        type: 'likert',
        answers: ['0', '1', '2', '3', '4'],
        legendType: 'bottom'
      }
    ]
  ];
  let answers = pages.map((p) => undefined);
</script>

<Page questions={pages[0]} bind:answers={answers[0]} on:next={() => {}} />
