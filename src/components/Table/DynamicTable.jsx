import React, { Component } from "react";
import Scrollbars from "react-custom-scrollbars";
import "./table.scss";
// import loading from "../../images/loading.gif";
class DynamicTable extends Component {
  render() {
    const { header, tableData, className } = this.props;
    if (this.props.isLoading) {
      return <div id="loader"></div>;
    } else {
      return (
        <div
          className={className ? "table_wrapper " + className : "table_wrapper"}
        >
          <div className="tbl-header">
            <table
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              cellPadding="0"
              cellSpacing="0"
              border="0"
              className="table_header"
            >
              <thead>
                <tr>
                  {header.map((item) => (
                    <th key={item}>{item}</th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>

          <div className="tbl-content">
            <Scrollbars
              autoHeight
              autoHeightMax="47vh"
              renderThumbHorizontal={({ style, ...props }) => {
                const thumbStyle = {
                  borderRadius: 6,
                  backgroundColor: "rgba(35, 49, 86, 0.8)",
                };
                return <div style={{ ...style, ...thumbStyle }} {...props} />;
              }}
              renderThumbVertical={({ style, ...props }) => {
                const thumbStyle = {
                  borderRadius: 6,
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  width: "3px",
                };
                return <div style={{ ...style, ...thumbStyle }} {...props} />;
              }}
            >
              <table
                cellPadding="0"
                cellSpacing="0"
                border="0"
                className="data_table"
              >
                <tbody>{tableData()}</tbody>
              </table>
            </Scrollbars>
          </div>
        </div>
        // <motion.table
        //   initial={{
        //     opacity: 0,
        //     scale: 0.9,
        //   }}
        //   animate={{
        //     opacity: 1,
        //     scale: 1,
        //   }}
        //   transition={{ duration: 0.5 }}
        //   className="tableContainer"
        //   style={this.props.style}
        // >
        //   <tbody>{this.props.children}</tbody>
        // </motion.table>
      );
    }
  }
}

export default DynamicTable;
