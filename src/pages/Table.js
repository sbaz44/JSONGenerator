import React from "react";
import DynamicTable from "../components/Table/DynamicTable";

export default function Table() {
  const renderData = () => {
    // return data.data.map((item) => {
    //   return (
    //     <tr>
    //       {data.header.map((headerItem, idx) => {
    //         return (
    //           //   <td>{item[headerItem.toLowerCase().replaceAll(" ", "_")]}</td>
    //           <td>
    //             {/* {data.data[idx][headerItem.toLowerCase().replaceAll(" ", "_")]} */}
    //             {data.data[idx][headerItem.toLowerCase().replaceAll(" ", "_")]}
    //           </td>
    //         );
    //       })}
    //     </tr>
    //   );
    // });

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

    return data.data.map((item) => console.log(item));
  };

  return (
    <div>
      <DynamicTable header={data.header} tableData={renderData} />
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
    {
      label: "image",
      image: [
        "https://source.unsplash.com/random/200x200?sig=1",
        "https://source.unsplash.com/random/200x200?sig=2",
        "https://source.unsplash.com/random/200x200?sig=3",
        "https://source.unsplash.com/random/200x200?sig=4",
        "https://source.unsplash.com/random/200x200?sig=5",
        "https://source.unsplash.com/random/200x200?sig=6",
        "https://source.unsplash.com/random/200x200?sig=7",
        "https://source.unsplash.com/random/200x200?sig=8",
        "https://source.unsplash.com/random/200x200?sig=9",
        "https://source.unsplash.com/random/200x200?sig=12",
      ],
    },
  ],
};
