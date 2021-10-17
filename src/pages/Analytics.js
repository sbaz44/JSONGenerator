import React, { useState } from "react";
import Button from "../components/Button";
import {
  DoughnutChart,
  Gauge,
  GroupedBarChart,
  PieChart,
  StackedBarChart,
  TextCard,
  VerticalBar,
} from "../components/GraphElement";
import Inputbox from "../components/Inputbox";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { useHistory } from "react-router";
import { axiosApiInstance } from "../helpers/request";
import Header from "../components/Header";
import Sidenav from "../components/Sidenav";

const SortableItem = sortableElement(({ value, title }) => (
  <div>{getGraphElement(value, title)}</div>
));

const getGraphElement = (type, title) => {
  if (type === "Bar Graph") {
    return <VerticalBar title={title} />;
  }
  if (type === "Pie Chart") {
    return <PieChart title={title} />;
  }
  if (type === "Doughnut Chart") {
    return <DoughnutChart title={title} />;
  }
  if (type === "Stacked Chart") {
    return <StackedBarChart title={title} />;
  }
  if (type === "Group Chart") {
    return <GroupedBarChart title={title} />;
  }
  if (type === "Gauge") {
    return <Gauge title={title} />;
  }
  if (type === "Text Card") {
    return <TextCard title={title} />;
  }
};

const SortableContainer = sortableContainer(({ children }) => {
  return <div className="graphs-container">{children}</div>;
});

const UserInput = (data) => {
  return (
    <div className="card2 card-5">
      <p class="close-btn" onClick={data.onClick}>
        &times;
      </p>
      <p>
        {data.index}.{data.title}
      </p>
      <Inputbox
        label="Title"
        value={data.value}
        onChange={data.onChange}
        onFocus={(event) => event.target.select()}
      />
    </div>
  );
};

export default function Analytics() {
  let history = useHistory();
  const [type, setType] = useState([
    "Bar Graph",
    "Pie Chart",
    "Doughnut Chart",
    "Stacked Chart",
    "Group Chart",
    "Gauge",
    "Text Card",
  ]);
  const [elementsList, setElementList] = useState([]);

  const typeClick = (type) => {
    const data = [...elementsList];
    let obj = {
      type: type,
      title: "Key name",
    };
    // let key = "element" + Object.keys(elementsList).length;
    // data[key] = obj;
    data.push(obj);
    setElementList(data);
  };

  const handleChange = (event, i) => {
    let data = [...elementsList];
    data[i].title = event.target.value;
    setElementList(data);
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    let newArr = arrayMoveImmutable(elementsList, oldIndex, newIndex);
    setElementList(newArr);
  };

  const removeInput = (i) => {
    let data = [...elementsList];
    data.splice(i, 1);
    console.log(data);
    setElementList(data);
  };

  const postData = async () => {
    let data = {
      serviceId: localStorage.getItem("serviceID"),
      details: elementsList,
    };
    let res = await axiosApiInstance.post(
      "service_mgmt/metadata/analytics",
      data
    );
    console.log(res);
    alert("Final Page reached");
    // history.push("/analytics");
  };
  return (
    <div className="analytics-wrapper">
      {console.log(elementsList)}
      <Header name="Analytics" />
      <div className="flex">
        <Sidenav />
        <div style={{ flex: "1" }}>
          <div className="card card-3">
            <div className="group_button">
              {type.map((item, index) => (
                <Button
                  onClick={() => typeClick(item)}
                  key={index + 36}
                  name={item}
                />
              ))}
            </div>
            <div className="type-wrapper">
              {elementsList.map((item, index) => (
                <UserInput
                  onChange={(e) => handleChange(e, index)}
                  key={index + 15}
                  value={item.title}
                  title={item.type}
                  index={index + 1}
                  onClick={() => removeInput(index)}
                />
              ))}
            </div>
            {/* {Object.keys(elementsList).map((item, index) => {
          return (
            <UserInput
              onChange={(e) => handleChange(e, item)}
              key={index + 15}
              value={elementsList[item].label}
              title={elementsList[item].type}
              index={index + 1}
            />
          );
        })} */}

            {/* <Inputbox
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /> */}
            <Button name="Submit" onClick={postData} />
          </div>
          <div className="card card-3 cardAdjust">
            <SortableContainer onSortEnd={onSortEnd}>
              {elementsList.map((item, index) => (
                <SortableItem
                  key={`item-${item.type}`}
                  index={index}
                  value={item.type}
                  title={item.title}
                />
              ))}
              {/* {Object.keys(elementsList).map(
            (item, index) => (
              <SortableItem
                key={`item-${elementsList[item].type}`}
                index={index}
                value={elementsList[item].type}
              />
            )
          )} */}
              {/* {this.state.graphs.map((item, index) => (
            <SortableItem
              key={`item-${item.type}`}
              index={index}
              value={item.type}
            />
          ))} */}
              {/* {items.map((value, index) => (
          <SortableItem key={`item-${value}`} index={index} value={value} />
        ))} */}
            </SortableContainer>
            {/* {Object.keys(elementsList).map((item, index) =>
          displayElements(elementsList[item].type)
        )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
