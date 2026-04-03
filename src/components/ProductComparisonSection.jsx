import Reveal from './Reveal'

export default function ProductComparisonSection() {
  return (
    <section className="comparison-section">
      <Reveal className="comparison-intro">
        <span className="story-label">Why SplitTrack stands out</span>
        <h2>More than a tracker. Softer than traditional finance tools.</h2>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>SplitTrack</th>
                <th>Basic tracker</th>
                <th>Typical split app</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Personal expense tracking</td>
                <td>✓</td>
                <td>✓</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Group expense splitting</td>
                <td>✓</td>
                <td>—</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Budget progress</td>
                <td>✓</td>
                <td>✓</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Aesthetic charts</td>
                <td>✓</td>
                <td>Sometimes</td>
                <td>Rarely</td>
              </tr>
              <tr>
                <td>Playful premium UI</td>
                <td>✓</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td>One space for personal + group finance</td>
                <td>✓</td>
                <td>—</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  )
}