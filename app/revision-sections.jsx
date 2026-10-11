import React from 'react'

export function RevisionSections({ revision }) {
  return (
    <div className="reading-content">
      {revision.sections.map((section) => (
        <section id={section.id} className="reading-section" key={section.id}>
          <h2>{section.title}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.files && (
            <ul className="file-list">
              {section.files.map((file) => (
                <li key={file.path}>
                  <a
                    href={`https://github.com/${revision.repository}/blob/${revision.commits[0]?.id ?? revision.base ?? 'HEAD'}/${file.path}`}
                  >
                    <code>{file.path}</code>
                  </a>
                  <p>{file.description}</p>
                </li>
              ))}
            </ul>
          )}
          {section.code && (
            <figure className="command-block">
              {section.codeCaption && <figcaption>{section.codeCaption}</figcaption>}
              <pre>
                <code>{section.code}</code>
              </pre>
            </figure>
          )}
          {section.items && (
            <ul className="reading-list">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}
