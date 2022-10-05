import React, { useState } from "react";
import DynamicTable from "../components/Table/DynamicTable";
import "../App.scss";
import Popup from "../components/Popup";
let selectedImage = null;
export default function Table() {
  const [ShowPop, setShowPop] = useState(false);
  const renderData = () => {
    let arr = data.data[0][data.data[0].label];
    // for (let i = 0; i < arrLength; i++) {
    //   for (let j = 0; j < data.header.length; j++) {
    //     console.log(data.data[j][data.data[j].label][i]);
    //   }
    // }
    console.log(arr);
    return arr.map((item, idx) => {
      return (
        <tr>
          {data.header.map((headerItem, index) => {
            if (headerItem.toLowerCase().includes("image")) {
              if (
                Array.isArray(data.data[index][data.data[index].label][idx])
              ) {
                return (
                  <td>
                    {data.data[index][data.data[index].label][idx].length === 0
                      ? "No Image"
                      : data.data[index][data.data[index].label][idx].map(
                          (imageItem, ImageIndex) => (
                            <img
                              className="image"
                              src={imageItem}
                              id={"img_" + ImageIndex}
                              onClick={() => {
                                selectedImage =
                                  data.data[index][data.data[index].label][idx];
                                console.log(selectedImage);
                                setShowPop(true);
                              }}
                            />
                          )
                        )}
                  </td>
                );
              } else
                return (
                  <td>
                    {data.data[index][data.data[index].label][idx] ? (
                      <img
                        className="image"
                        src={data.data[index][data.data[index].label][idx]}
                        onClick={() => {
                          selectedImage =
                            data.data[index][data.data[index].label][idx];
                          console.log(selectedImage);
                          setShowPop(true);
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                );
              // if(Array.isArray())
            } else
              return <td>{data.data[index][data.data[index].label][idx]}</td>;
          })}
        </tr>
      );
    });

    // return data.data.map((item) => (
    //   <tr>
    //     {Object.values(item).map((value) => {
    //       if (Array.isArray(value)) {
    //         console.log(value);
    //         return value.map((x) => <td>{x}</td>);
    //       }
    //     })}
    //     {/* <td>{item.sr_no} </td>
    //     <td>{item.name} </td>
    //     <td>{item.sr_no} </td>
    //     <td>{item.sr_no} </td> */}
    //   </tr>
    // ));

    // return data.data.map((item) => {});
  };

  return (
    <div className="table">
      <DynamicTable header={data.header} tableData={renderData} />
      {ShowPop && (
        <Popup onClick={() => setShowPop(false)}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
            className="image__pop"
          >
            {Array.isArray(selectedImage) ? (
              <div>
                <img src={selectedImage[0]} />
              </div>
            ) : (
              <div>
                <img src={selectedImage} />
              </div>
            )}
          </div>
        </Popup>
      )}
    </div>
  );
}

const data = {
  header: ["Sr No", "Name", "Age", "Image"],
  data: [
    {
      label: "sr_no",
      sr_no: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
      label: "name",
      name: [
        "Jillie",
        "Cleo",
        "Tiebold",
        "Moreen",
        "Symon",
        "Osborne",
        "Moore",
        "Bartholemy",
        "Alanson",
        "Roshelle",
      ],
    },
    {
      label: "age",
      age: [11, 23, 31, 24, 53, 61, 27, 28, 49, 30],
    },
    // {
    //   label: "phone",
    //   phone: [
    //     123, 43245, 4234, 245435, 23, 234, 2345435, 234234, 124234, 234234,
    //   ],
    // },
    {
      label: "image",
      image: [
        [
          "https://source.unsplash.com/random/200x200?sig=1",
          "https://source.unsplash.com/random/200x200?sig=5",
          "https://source.unsplash.com/random/200x200?sig=8",
        ],
        [],
        "https://source.unsplash.com/random/200x200?sig=3",
        "https://source.unsplash.com/random/200x200?sig=4",
        "https://source.unsplash.com/random/200x200?sig=5",
        "https://source.unsplash.com/random/200x200?sig=6",
        "https://source.unsplash.com/random/200x200?sig=7",
        "https://source.unsplash.com/random/200x200?sig=8",
        "https://source.unsplash.com/random/200x200?sig=9",
        "",
      ],
    },
  ],
};
