import React, { Component } from "react";
import { render } from "react-dom";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import {
  DoughnutChart,
  Gauge,
  GroupedBarChart,
  PieChart,
  StackedBarChart,
  VerticalBar,
} from "./components/GraphElement";

const SortableItem = sortableElement(({ value }) => (
  <li>{getGraphElement(value)}</li>
));

const getGraphElement = (type) => {
  if (type === "pie") {
    return <PieChart />;
  }
  if (type === "bar") {
    return <VerticalBar />;
  }

  if (type === "doughnut") {
    return <DoughnutChart />;
  }
  if (type === "stacked") {
    return <StackedBarChart />;
  }
  if (type === "grouped") {
    return <GroupedBarChart />;
  }
  if (type === "gauge") {
    return <Gauge />;
  }
};

const SortableContainer = sortableContainer(({ children }) => {
  return <ul>{children}</ul>;
});

class Graphs extends Component {
  state = {
    items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"],
    graphs: [
      {
        type: "bar",
      },
      {
        type: "pie",
      },
      {
        type: "doughnut",
      },
      {
        type: "stacked",
      },
      {
        type: "grouped",
      },
      {
        type: "gauge",
      },
    ],
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ graphs }) => ({
      graphs: arrayMoveImmutable(graphs, oldIndex, newIndex),
    }));
  };

  render() {
    const { items } = this.state;

    return (
      <div>
        <SortableContainer onSortEnd={this.onSortEnd}>
          {console.log(this.state.graphs)}
          {this.state.graphs.map((item, index) => (
            <SortableItem
              key={`item-${item.type}`}
              index={index}
              value={item.type}
            />
          ))}
          {/* {items.map((value, index) => (
          <SortableItem key={`item-${value}`} index={index} value={value} />
        ))} */}
        </SortableContainer>
        {/* <PieChart />
        <VerticalBar /> */}
      </div>
    );
  }
}
export default Graphs;
