import Head from "next/head";
import _fetch from "isomorphic-fetch";
import { years, baseUrl } from "../utils";
import { useState, useEffect } from "react";

function Home(props) {
  const [state, setstate] = useState({
    launch_year: "",
    launch_success: "",
    land_success: "",
    launches: props.launches,
    isLoading: false,
    error: false,
  });
  useEffect(() => {
    if (state.launch_year !== "") {
      getLaunches();
    }
  }, [state.launch_year]);
  useEffect(() => {
    if (state.launch_success !== "") {
      getLaunches();
    }
  }, [state.launch_success]);
  useEffect(() => {
    if (state.land_success !== "") {
      getLaunches();
    }
  }, [state.land_success]);
  const getLaunches = async () => {
    setstate({ ...state, isLoading: true });
    const newS = { ...state };
    delete newS.launches;
    let url = baseUrl;
    Object.keys(newS).map((data, i) => {
      if (state[data] !== "") {
        url = url + "&" + data + "=" + newS[data].toString();
      }
    });
    try {
      const res = await _fetch(url);
      const json = await res.json();
      setstate({ ...state, launches: json, isLoading: false, error: false });
    } catch (err) {
      setstate({ ...state, launches: [], isLoading: false, error: true });
    }
  };
  return (
    <div className="container">
      <Head>
        <title>SpaceX Launch Program</title>
        <link rel="icon" href="/spacex.png" />
      </Head>

      <h1 className="title">SpaceX Launch Programs</h1>
      <main className="main-section">
        <div className="filters">
          <h4>Filters</h4>
          <div className="year-filters">
            <span className="filter-header">Launch Year</span>
            <div className="filter-selector">
              {years.map((data, i) => {
                return (
                  <div className="button-wrapper">
                    <button
                      disabled={state.isLoading}
                      key={i}
                      onClick={() => {
                        setstate({
                          ...state,
                          launch_year: data,
                        });
                      }}
                      className={`filter-item ${
                        state.launch_year === data ? "active" : ""
                      }`}
                    >
                      {data}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="launch-filters">
            <span className="filter-header">Successful Launch</span>
            <div className="filter-selector">
              <div className="button-wrapper">
                <button
                  disabled={state.isLoading}
                  onClick={() => {
                    setstate({
                      ...state,
                      launch_success: true,
                    });
                  }}
                  className={`filter-item ${
                    state.launch_success ? "active" : ""
                  }`}
                >
                  True
                </button>
              </div>
              <div className="button-wrapper">
                <button
                  disabled={state.isLoading}
                  onClick={() => {
                    setstate({
                      ...state,
                      launch_success: false,
                    });
                  }}
                  className={`filter-item ${
                    state.launch_success !== "" && !state.launch_success
                      ? "active"
                      : ""
                  }`}
                >
                  False
                </button>
              </div>
            </div>
          </div>
          <div className="landing-filters">
            <span className="filter-header">Successful Landing</span>
            <div className="filter-selector">
              <div className="button-wrapper">
                <button
                  disabled={state.isLoading}
                  onClick={() => {
                    setstate({
                      ...state,
                      land_success: true,
                    });
                  }}
                  className={`filter-item ${
                    state.land_success ? "active" : ""
                  }`}
                >
                  True
                </button>
              </div>
              <div className="button-wrapper">
                <button
                  disabled={state.isLoading}
                  onClick={() => {
                    setstate({
                      ...state,
                      land_success: false,
                    });
                  }}
                  className={`filter-item ${
                    state.land_success !== "" && !state.land_success
                      ? "active"
                      : ""
                  }`}
                >
                  False
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`grid ${
            state.isLoading || !state.launches.length || state.error
              ? "loading"
              : ""
          }`}
        >
          {state.isLoading ? (
            <div class="loader"></div>
          ) : state.launches.length && !state.error ? (
            state.launches.map((data, i) => {
              return (
                <div className="card" key={i}>
                  <div className="img-container">
                    <img
                      src={data.links.mission_patch_small}
                      alt={data.mission_name}
                    />
                  </div>
                  <div className="mission-details">
                    <span className="mission-title">
                      {data.mission_name} # {data.flight_number}
                    </span>
                    <div>
                      <span className="key">Mission Ids:</span>
                      {data.mission_id.length ? (
                        <ul>
                          {data.mission_id.map((data, i) => {
                            return <li key={i}>{data}</li>;
                          })}
                        </ul>
                      ) : (
                        <span className="value">No Id Found</span>
                      )}
                    </div>
                    <div className="details-pair">
                      <span className="key">Launch Year:</span>
                      <span className="value">{data.launch_year}</span>
                    </div>
                    <div className="details-pair">
                      <span className="key">Successful Launch:</span>
                      <span className="value">
                        {data.launch_success == true ||
                        data.launch_success == false
                          ? data.launch_success.toString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="details-pair">
                      <span className="key">Successful Landing:</span>
                      <span className="value">
                        {data.launch_landing ? data.launch_landing : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : state.error ? (
            <div>Error Occured</div>
          ) : (
            <div>No data found</div>
          )}
        </div>
      </main>

      <footer className="footer">
        <span>Devloped By Sagarchand Samal</span>
      </footer>
    </div>
  );
}

Home.getInitialProps = async () => {
  try {
    const res = await _fetch(baseUrl);
    const json = await res.json();
    return { launches: json };
  } catch (err) {
    return { launches: [], error: true };
  }
};
export default Home;
