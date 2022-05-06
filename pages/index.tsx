import Image from "next/image";
import { useEffect, useState } from "react";

const index = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://sub.id/api/v1/chains/properties")
      .then((res) => res.json())
      .then((json) => {
        const entries = Object.entries(json)
          .filter(
            ([, value]: [any, any]) =>
              value.tokenSymbols && value.tokenDecimals,
          )
          .sort(function (a, b) {
            if (a[0] > b[0]) {
              return -1;
            }
            if (b[0] > a[0]) {
              return 1;
            }
            return 0;
          });
        setData(entries);
      });
    const intervalId = setInterval(() => {
      fetch("https://sub.id/api/v1/chains/properties")
        .then((res) => res.json())
        .then((json) => {
          const entries = Object.entries(json)
            .filter(
              ([, value]: [any, any]) =>
                value.tokenSymbols && value.tokenDecimals,
            )
            .sort(function (a, b) {
              if (a[0] > b[0]) {
                return -1;
              }
              if (b[0] > a[0]) {
                return 1;
              }
              return 0;
            });
          setData(entries);
        });
    }, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return data.length === 0 ? (
    <p>loading ...</p>
  ) : (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map(([k, v]) => (
          <tr>
            <th scope="row">
              <h2>
                {v.name}
                <span>
                  <Image
                    width={48}
                    height={48}
                    src={`https://sub.id/images/${v.icon}`}
                  />
                </span>
              </h2>
            </th>
            <td>
              {fetch("https://sub.id/api/v1/check/" + k)
                .then((v) => v.text())
                .then((v) => v) ? (
                <div
                  style={{
                    padding: "12px",
                    background: "green",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <span
                  style={{
                    padding: "12px",
                    borderRadius: "50%",
                    backgroundColor: "red",
                  }}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default index;
