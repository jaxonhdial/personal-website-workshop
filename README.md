## !! READ BEFORE STARTING !!
You'll need Node.js 20.9+ for this repo to work. Visit https://nodejs.org to install it on your machine if you haven't already. You can run `node -v` in your terminal to check if it is already installed.

This repo uses `npm` for package management. This should be installed along with Node.js. Run `npm -v` to ensure it is installed.

The teck stack for the website is React + Next.js using TypeScript and Tailwind CSS. It also uses a linter, ESLint, for style-checking.

### How to Fork and Clone This Repo Locally
First, navigate to the original GitHub repository in your browser and click the **Fork** button in the top-right corner. Choose your GitHub account as the destination. This creates a copy of the repository under your account.

Next, clone your fork to your local machine:

1. Go to your forked repository on GitHub.
2. Click the **Code** button and copy the HTTPS URL.
3. Ensure you are in the correct directory on your machine
4. Open a terminal and run:
   ```bash
   git clone <PASTE_REPO_URL_HERE>
   ```
   For example
   ```bash
   git clone https://github.com/your-username/repo-name.git
   ```
   
### How to use this repo
All scripts can be found in `package.json` under `scripts`. The two you really need to care about are `dev` and `lint`.

`dev`: Creates a localhost instance of your website, running on one of your ports. If you visit that localhost port in your browser, your website will pop up.
`lint`: Checks for issues in your repo, from bugs to style issues.

You can run either by prepending `npm run <script>` to them. For example, `npm run dev` run the `dev` script.

### Useful links
- Tailwind CSS cheat sheet: https://nerdcave.com/tailwind-cheat-sheet
- More of a guide then a cheat sheet, but here's one for React: https://github.com/HassanHabibTahir/React-cheatsheet (as a side note, personal websites, and especially homepages, won't need anything super complicated in React)
- Next/Link is great for adding links: https://nextjs.org/docs/app/api-reference/components/link
- Next/Image is great for adding images: https://nextjs.org/docs/app/api-reference/components/image
- Here's some info on how to create subpages with Next.js App Router: https://nextjs.org/docs/app/getting-started/layouts-and-pages

# Getting Started
1. Fork this repo. Ensure your fork is public.
2. Work on the website. The main page lives under page.tsx. For more on the structure of a project, visit https://nextjs.org/docs/app/getting-started/project-structure for details.
3. Answer the questions in the heading below. Keep your answers descriptive and concise. You can use the questions to guide your website development.
4. Thats it! Have fun! We'll look at forks from the main repo to ensure valid entries into the raffle.

# Questions - MUST ANSWER TO BE ENTERED INTO RAFFLE!
1. Briefly describe everything you've added on from the starter template.

I've added new fonts that are inspired by Terraria's main menu. I've also added an easter egg with the sun that takes you to a page that mimics Mike Scott's home page.

2. What's the first impression you want a website visitor to have about you? How does your website accomplish that?

I want the website visitor to see the fun fonts and fun background and see that I'm a fun, bubbly person. Also, I want everybody who's in UTCS to recognize the easter egg of the yellow rock wall paper to have a fun inside joke.

3. What's your favorite part of the website you've made? What needs improvement?

The easter egg page is a lot of fun. Currently everything has been vibe coded and none of the actual content has been changed, so that needs to be worked on.

4. Where would you take your website in the future? Talk about additonal sections, aspirations, etc.

I'll add sections for my projects and add information about myself to the about section. Additionally, I want to link my UIL Analyzer website to that section when it's finished, so people can easily go to the project I'm most proud of.
