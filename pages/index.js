import Head from "next/head";
import _fetch from "isomorphic-fetch";

function Home(props) {
  console.log(props,"sdbsdgjsgdjgsjdsd")
  return (
    <div className="container">
      <Head>
        <title>SpaceX Launch Program</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main-section">
        <h1 className="title">
          SpaceX Launch Programs
        </h1>
        <div className="filters">

        </div>
        <div className="grid"></div>
      </main>

      <footer className="footer">
        <span>Devloped By Sagarchand Samal</span>
      </footer>
    </div>
  );
}

Home.getInitialProps = async () => {
  const res = await _fetch('https://api.spacexdata.com/v3/launches?limit=100')
  const json = await res.json()
  return { launches: json }
}
export default Home;