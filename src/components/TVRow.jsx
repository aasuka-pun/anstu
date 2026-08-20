import TVCard from './TVCard'

function TVRow({ title, shows }) {
  return (
    <section className="movie-row">

      <div className="movie-row-header">
        <h2>{title}</h2>
      </div>

      <div className="movie-row-list">
        {shows.map((show) => (
          <TVCard
            key={show.id}
            show={show}
          />
        ))}
      </div>

    </section>
  )
}

export default TVRow