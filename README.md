This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

### To run the project  use these commands
```bash

npm install

#then
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<!-- Summary -->

1. I have add an Form where user can ennter the card details, applied proper validation using react-hoo-form and zod,
2. Kept button disabled until all fields are compelety filled.
3. Added and card preview too where user can see the preview the the card with some gradiant background
4. I also added Card image for visa,mastercard and amex the image displayed based of the card nubmer starting digits.
5. For Payment simulation when user clicks submit i added a small processing time of 2 seconds then the api hits.
6. I have generated a random number in api/pay route and if number below 0.6 means below 60% the payment response is "success"
7. on 60-85% the payment gets failed.
8. and on below 85%-100% the 8 sec timout runs and retuerns timeout error

9. in frontent i add abord controller with timeout of 6 seconds after 6 seconds the request get rejected and the payment status updated to the timeout,
10. Added retry button so that user can retry 3 time and if all tries filled the forms resets and modals closes after 2 sec delay.
11. Added transaction page where user can see his transaction with the status and attemps made.
12. Made the design responsive based on mobile and desktop view-port
13. Used redux toolkit for updating payment status and and Adding transactions.
14. the Transaction persists on refresh (stored them in local storage).
15. made seperate components for each like mobile cards, desktop row, cardpreview. for shared ui

### Tech that i used
Nextjs, ShadcnUI, TailwindCSS, radux Toolkit
