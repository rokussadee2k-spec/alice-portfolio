/* ---------------------------------------------------------------
   EVERYTHING YOU WILL EVER NEED TO EDIT LIVES IN THIS FILE.
   Titles, descriptions, contact details and file paths.

   All asset paths start at /works/... which maps to the folder
   public/works/... in this project.
   --------------------------------------------------------------- */
const NORMAL_PAGES = 16

export const profile = {
  name: 'Alice Payan',
  role: 'Artist and publisher',
  location: 'Brussels, BE',
  email: 'alicepayan208@gmail.com',
  instagram: 'funky_grenadine',
  instagramUrl: 'https://instagram.com/funky_grenadine',
  bio: `I make publications, printed matter and installations. Most of the work
  starts as writing and ends up as something you hold or walk through: a scanned
  book, a lamp, a letter left on a table. Recent work has circled around
  borrowed voices — fan writing, thesis footnotes, overheard music — and what
  happens to them once they are set in type. Available for commissions,
  exhibitions and editing work.`
}

export const works = [
  /* ------------------------------------------------------------- */
 {
    id: 'master-thesis',
    title: 'Word Domination',
    meta: 'Publication · 2024 – 2025',
    description: `Série de réflexions et de questionnements partant du principe que l'écriture, sa forme, ses lignes et les supports sur lesquels elle s'étend sont une énigme.`,
    blocks: [
      {
        type: 'row',
        
        items: [
          { src: '/works/master-thesis/extra-cover/1.jpg', alt: 'Cover, first printing' },
          
          { src: '/works/master-thesis/extra-cover/3.jpg', alt: 'Cover, third printing' }
        ]
      },
      {
        type: 'carousel',
        caption: 'Scan livre',
        // 55 pages: /works/master-thesis/scan-livre/01.jpg ... 55.jpg
        items: Array.from({ length: 55 }, (_, i) => {
          const n = String(i + 1).padStart(2, '0')
          return {
            src: `/works/master-thesis/scan-livre/scan-livre-${n}.jpg`,
            alt: `Scan livre, page ${i + 1} of 55`
          }
        }),
        aspect: '3 / 2' // shape of the page box; adjust to match your scans
      },
      {
        type: 'download',
        href: '/works/master-thesis/scan-livre.pdf',
        label: 'scan-livre.pdf',
        note: 'Download the flipbook version of this publication'
      }
    ]
  },

  /* ------------------------------------------------------------- */
  {
    id: 'i-give-the-music-to',
    title: 'Thank you',
    meta: 'Part de l’installation : I give the music for good memory to you - 2024',
    description: `Lettre de remerciement à Evan Duffy, qui reprend le célèbre morceau de musique électronique <i>Strobe</i> au piano. Cette lettre se construit à partir de collage de commentaires Youtube, témoignant d’expériences d’écoute. Ces mots adressés à la même personne deviennent un récit à la fois collectif et individuel. Cette lettre va de pair avec une lampe reprenant la partition du morceau.`,
    blocks: [
      {
        type: 'masonry',
        items: [
          { src: '/works/i-give-the-music-to/exhibition-view-1.jpg', alt: 'Exhibition view, wide shot of the installation' },
          { src: '/works/i-give-the-music-to/exhibition-view-2.jpg', alt: 'Exhibition view from the side' },
          // { src: '/works/i-give-the-music-to/img-1620.jpg', alt: 'Detail of the table' },
          { src: '/works/i-give-the-music-to/lamp.jpg', alt: 'The lamp lighting the table' },
                    {
            type: 'text',
            heading: 'Letter to Evan',
            body: `Hope you're doing well after all this time, Evan.
Coming back after this eight long years, those were such different times…
I lost my dog a few days ago, he was old ans sick.
We talked to him that he can leave in peace, that he shouldn't be afraid of anything.
Anyway, just wanted to let you know that after all this time, here I am again.
Evan, I just want to say thank you.
One wise man said « Music is what feelings sounds like », there are songs that makes you feel happy, energetic, relaxed…You are a great person, I can tell just by listening to your music. Where words fails, music speaks!
Small things that give me hope is the beauty that lives within each of us, if only we can be brave enough to choose.
I honestly think that this music has had more impact on me than anything else I've ever seen, and I think no one has been effected as much as me by this.
I've been through eight states and now Hawaii, eight years, four jobs, high-school, college, four girlfriends and a marriage with this song always in front of my head.
This song changed me as a person, this song made me do something different, this song made my ways different.
This wouldn't have been possible without that amount of passion, simply beautiful.
Not many players out there that can bring me to tears!
There was so much thought put into every notes, the amount of pressure, the type of release…
There was a point where I did not want to stop… and there was a point where I could not stop smiling in happiness.
The end of this song feels like what I'd like to imagine a peaceful death in old age feels like.
Echos of the earlier feelings of excitement as it fades out.
The way you play, you make the piano feel alive somehow…I can't quite explain it.
Can you imagine Chopin would think of this if he heard it?
It gives me goosebumps to think about.
This will always be fucking amazing.
This has been one of my favorite song since I heard it eleven years ago.
«  First part : Something bad happened in life
    Second part : Everything starts again, another chance, it's becoming a great life. »
But as time passed I got busy with life and forgot some things along the way.
Luckily, tonight I randomly remembered your name from your music and took a great trip down memory lane. Just does not get old.
Evan, you did an amazing job and nearly eight years later I still come back, and it hits me in the soul the exact same way it did the first time.
I love how the piano brings out the true beauty of this song and put it in a way every person of any age and culture can enjoy.
Whenever I want to remember happier days, I listen to your version of Strobe and it helps me get better.
Great work, Evan.
Live long and prosper.
May the wind be at your back.`
          }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------- */
  

  /* ------------------------------------------------------------- */
  {
    id: 'today-i-dug-a-little-hole',
    title: 'Today I dug a little hole, thinking of you',
    meta: 'Performance - 2023',
    description: `Processus de répétition écrite et orale d’un texte sur le deuil amoureux. Les bruits du processus sont amplifiés par un micro piézo. Le texte ainsi répété, à l’instar d’une chanson pop, devient un refrain que l’on connaît par cœur. Dans le même temps, le texte écrit sur un support plastique transparent, s’accumule et perd de sa lisibilité à chaque exemplaire superposé.`,
    blocks: [
      {
        type: 'masonry',
        items: [
          { src: '/works/today-i-dug-a-little-hole/exhibition-view-1.jpg', alt: 'Exhibition view, hanging sheets' },
          { src: '/works/today-i-dug-a-little-hole/exhibition-view-2.jpg', alt: 'Exhibition view from the entrance' },
          { src: '/works/today-i-dug-a-little-hole/exhibition-view-3.jpg', alt: 'Exhibition view, detail of the room' },
          { src: '/works/today-i-dug-a-little-hole/img-9151.jpg', alt: 'Detail of a printed sheet' },
          { src: '/works/today-i-dug-a-little-hole/layered-text.jpg', alt: 'Layered text seen straight on' }
          ,{ src: '/works/today-i-dug-a-little-hole/process-1.jpg', alt: '' }
          ,{ src: '/works/today-i-dug-a-little-hole/process-2.jpg', alt: '' }
          ,{ src: '/works/today-i-dug-a-little-hole/process-3.jpg', alt: '' }
          ,{ src: '/works/today-i-dug-a-little-hole/process-4.jpg', alt: '' }
        ]
      }
    ]
  },
  {
    id: 'fanfiction',
    title: 'Normalement, il est rare que tous les épis d’une tête, ou même d’un champ, soient tous de la même qualité et robustesse.',
    meta: '2022',
    description: `Micro-édition reprenant une partie de la fanfiction <i>Mon épi-centre</i>, série d’observations sur les états capillaires de mon professeur de littérature. Images pixellisées créées à partir d’images de plantes. La fanfiction originale s’est écrite pendant les cours traitant de <i>La mort de l’auteur</i>, et cherche à poser cette question ; dans le contexte de la fanfiction, n’est-ce pas au sujet de celle-ci, d’apprendre à mourir ?`,
   blocks: [
      {
        type: 'flipbook',
        caption: 'NORMAL',
 
        // NORMAL.pdf exported to images, same as Scan livre.
        // Set NORMAL_PAGES at the top of this file to the real page count.
        items: Array.from({ length: NORMAL_PAGES }, (_, i) => {
          const n = String(i + 1).padStart(2, '0')
          return {
            src: `/works/fanfiction/normal/${n}.jpg`,
            alt: `NORMAL, page ${i + 1}`
          }
        }),
 
        // shape of a SINGLE page: width / height. A4 portrait is 210/297.
        pageAspect: 210 / 297,
        cover: true,
        // optional: a link out to the original file
        pdf: '/works/fanfiction/NORMAL.pdf',
        pdfLabel: 'open the pdf'
      }
    ]
  }
]
