# Master Thesis

My master thesis is about the comparison of two UIs for privacy settings. In order to determine this, a study is conducted. In this study, a questionnaire is asked, which first asks general information about the user. This is followed by the IUIPC-10 scale. After the general information is determined, the users are shown 2 different UIs in random order. There they have to complete different tasks. After each UI, a usability questionnaire (SUS) is asked. During the execution, meta information is collected to track the behavior afterwards.
All questions and tasks are in German, since the study also takes place in German-speaking countries.

## Data protection and privacy

No IP addresses or other personal data are stored. The only information that is stored is the user agent to track whether the user completed the tasks from a smartphone.

## Developing

This tool is implemented with SvelteKit. During development SvelteKit was still in beta and breaking changes may still exist.
More about SvelteKit and the basic structure of a SvelteKit project in der [Dokumentation](https://kit.svelte.dev/docs).
To start the development `node` must be installed. After that the following points can be done.

1. Clone the project and install dependencies:

```bash
npm install
```

2. Set up a MySQL database including database user.
   The credentials must be added in the [knexfile.js](knexfile.js).

3. Run the migrations.

```bash
knex --esm migrate:latest
```

4. Run the development server.

```bash
npm run dev
```

## Creating a new UI

It is recommeded to read first the design and documentation chapter of the master thesis.

A new UI component is created by wrapping it in a `NewPostPrivacy` component.
The component `NewPostPrivacy` is a modal.
It already implements first tracking functions and the send button.
A UI should contain a `TaskTrackingStore`, the `members` (contact list on which the user makes changes) and the `defaultMembers` (initial contact list which is used to undo all changes in the `members` array).
Die Komponente
The sensitivity value of a task.
A new UI can be added in the file [](src/routes/ui/[ui].svelte).
The task functionality is additionally implemented here.

## Study preparation

The study preparation is explained in the master thesis.

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
