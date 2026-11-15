/* The shelf on the Beyond page. Favourites go first, then recent reads. Add a
   book by adding a line to the list:

     { title: 'Title', author: 'Author', cover: '/beyond/covers/file.webp' }

   Optional: favourite: true (marks it on the shelf), note (one line, shown on
   hover). author may be left out. */

const C = '/beyond/covers/';

window.BOOKSHELF = {
  books: [
    // favourites
    { title: 'User Friendly', author: 'Cliff Kuang with Robert Fabricant', cover: C + 'user-friendly.webp', favourite: true, note: 'How the Hidden Rules of Design Are Changing the Way We Live, Work, and Play' },
    { title: 'Shikake', author: 'Naohiro Matsumura', cover: C + 'shikake.webp', favourite: true, note: 'The Japanese Art of Shaping Behavior Through Design' },
    { title: 'Design for People', author: 'Scott Stowell', cover: C + 'design-for-people.webp', favourite: true },
    { title: 'We’ll Prescribe You a Cat', author: 'Syou Ishida', cover: C + 'well-prescribe-you-a-cat.webp', favourite: true },
    { title: 'What You Are Looking For Is in the Library', author: 'Michiko Aoyama', cover: C + 'what-you-are-looking-for.webp', favourite: true },
    { title: 'Kitchen', author: 'Banana Yoshimoto', cover: C + 'kitchen.webp', favourite: true },
    { title: 'There’s No Such Thing as an Easy Job', author: 'Kikuko Tsumura', cover: C + 'easy-job.webp', favourite: true },
    // recent reads
    { title: 'Daily Rituals: Women at Work', author: 'Mason Currey', cover: C + 'daily-rituals-women-at-work.webp' },
    { title: 'The Things We Never Say', author: 'Elizabeth Strout', cover: C + 'the-things-we-never-say.webp' },
    { title: 'I Who Have Never Known Men', author: 'Jacqueline Harpman', cover: C + 'i-who-have-never-known-men.webp' },
    { title: 'Normal People', author: 'Sally Rooney', cover: C + 'normal-people.webp' },
    { title: 'Anthropologists', author: 'Ayşegül Savaş', cover: C + 'anthropologists.webp' },
    { title: 'Crying in H Mart', author: 'Michelle Zauner', cover: C + 'crying-in-h-mart.webp' },
    { title: 'Audition', author: 'Katie Kitamura', cover: C + 'audition.webp' },
    { title: 'Everything I Know About Love', author: 'Dolly Alderton', cover: C + 'everything-i-know-about-love.webp' },
    { title: 'God of Small Things', author: 'Arundhati Roy', cover: C + 'god-of-small-things.webp' },
    { title: 'Why the Poor Don’t Kill Us', author: 'Manu Joseph', cover: C + 'why-the-poor-dont-kill-us.webp' },
    { title: 'Strangers', author: 'Belle Burden', cover: C + 'strangers.webp' },
    { title: 'The Creative Act', author: 'Rick Rubin', cover: C + 'the-creative-act.webp' },
  ],
};
