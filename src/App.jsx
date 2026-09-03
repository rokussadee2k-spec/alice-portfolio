import { useState } from 'react'
import { profile, works } from './data.js'
import StampedName from './components/Stampedname.jsx'
import CursorBlob from './components/Cursorblob.jsx'
import Accordion from './components/Accordion.jsx'
import Masonry from './components/Masonry.jsx'
import Flipbook from './components/Flipbook.jsx'
import Carousel from './components/Carousel.jsx'
import { Row, Download, RichText } from './components/Blocks.jsx'

function Block({ block }) {
  switch (block.type) {
    case 'masonry':
      return <Masonry items={block.items} />
    case 'flipbook':
      return (
        <Flipbook
          items={block.items}
          caption={block.caption}
          pageAspect={block.pageAspect}
          cover={block.cover}
          pdf={block.pdf}
          pdfLabel={block.pdfLabel}
        />
      )
    case 'row':
      return <Row items={block.items} caption={block.caption} />
    case 'carousel':
      return <Carousel items={block.items} caption={block.caption} aspect={block.aspect} />
    case 'download':
      return <Download {...block} />
    default:
      return null
  }
}

export default function App() {
  // one open at a time; set to works[0].id to open the first by default
  const [openId, setOpenId] = useState(null)

  return (
    <div className="page">
      <CursorBlob />

      <header className="masthead">
        <div className="identity">
          <h1 className="name">
            <StampedName text={profile.name} interval={1000} />
          </h1>
        </div>

        <address className="contact">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </address>
      </header>

      <main className="works">
        {works.map((work) => (
          <Accordion
            key={work.id}
            title={work.title}
            meta={work.meta}
            open={openId === work.id}
            onToggle={() => setOpenId(openId === work.id ? null : work.id)}
          >
            <div className="work-description">
              <RichText text={work.description} />
            </div>
            {work.blocks.map((block, n) => (
              <Block key={n} block={block} />
            ))}
          </Accordion>
        ))}
      </main>

      <footer className="foot">
        <span>{profile.name}</span>
        <span>{new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}