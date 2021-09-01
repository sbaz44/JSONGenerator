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

const SortableItem = sortableElement(({ value }) => (
  <div>{getGraphElement(value)}</div>
));

const getGraphElement = (type) => {
  if (type === "Bar Graph") {
    return <VerticalBar />;
  }
  if (type === "Pie Chart") {
    return <PieChart />;
  }
  if (type === "Doughnut Chart") {
    return <DoughnutChart />;
  }
  if (type === "Stacked Chart") {
    return <StackedBarChart />;
  }
  if (type === "Group Chart") {
    return <GroupedBarChart />;
  }
  if (type === "Gauge") {
    return <Gauge />;
  }
  if (type === "Text Card") {
    return <TextCard />;
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
        // onFocus={data.onFocus}
      />
    </div>
  );
};

export default function Analytics() {
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
      label: "Key name",
    };
    // let key = "element" + Object.keys(elementsList).length;
    // data[key] = obj;
    data.push(obj);
    setElementList(data);
  };

  const handleChange = (event, i) => {
    let data = [...elementsList];
    data[i].label = event.target.value;
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
  return (
    <div className="analytics-wrapper">
      {console.log(elementsList)}
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
              value={item.label}
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
        <Button name="Submit" />
      </div>
      <div className="card card-3 cardAdjust">
        <SortableContainer onSortEnd={onSortEnd}>
          {elementsList.map((item, index) => (
            <SortableItem
              key={`item-${item.type}`}
              index={index}
              value={item.type}
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
  );
}
