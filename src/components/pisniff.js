import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import {
  Spinner,
  Modal,
  Card,
  CardHeader,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import { MDBDataTable } from "mdbreact";

const Sniff = (props) => {
  let directedProbePingCount = 0;
  let nullProbePingCount = 0;
  let probes = [];
  let directedPings = [];
  let nullPings = [];
  let pings = [];
  const data = {
    columns: [
      {
        label: "Timestamp",
        field: "timestamp",
        sort: "asc",
      },
      {
        label: "MAC ID",
        field: "mac_id",
        sort: "asc",
      },
      {
        label: "RSSI",
        field: "rssi",
        sort: "asc",
      },
      {
        label: "SSID",
        field: "ssid",
        sort: "asc",
      },
    ],
    rows: pings,
  };
  var UniqueNames = [];

  if (!props.error && !props.isLoading) {
    probes = props.probes;
    if (probes.length) {
      probes.forEach((element, index) => {
        if (element.nullProbe) {
          nullProbePingCount += 1;
          nullPings.push(element.nullProbe);
          pings.push(element.nullProbe);
        }
        if (element.directedProbe) {
          directedProbePingCount += 1;
          UniqueNames.push(element.directedProbe.ssid);
          directedPings.push(element.directedProbe);
          pings.push(element.directedProbe);
        }
        // if (element.frame.probes.directed.length) {
        //   directedProbePingCount += element.frame.probes.directed.length;
        //   UniqueNames.push(element.frame.probes.directed.map(function (d) {
        //     return d.ssid;
        //   }));
        //   directedPings.push(...element.frame.probes.directed);
        // }
        // if (element.frame.probes.null.length) {
        //   nullProbePingCount += element.frame.probes.null.length;
        //   nullPings.push(...element.frame.probes.null);
        // }
        // if (
        //   element.frame.probes.null.length ||
        //   element.frame.probes.directed.length
        // ) {
        //   pings.push(...element.frame.probes.directed);
        //   pings.push(...element.frame.probes.null);
        // }
      });
    }
  }
  var merged = [].concat.apply([], UniqueNames);
  var names = merged.filter((item, i, ar) => ar.indexOf(item) === i);
  const listItems = names.map((name) => <li key={name}>{name}</li>);

  return (
    <div className="content">
      {props.error
        ? (
          <Modal.Dialog size="lg">
            <Modal.Header closeButton onHide={props.handleMessageDismiss}>
              <Modal.Title>Something went wrong</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{props.errorMessage}</p>
            </Modal.Body>
          </Modal.Dialog>
        )
        : (
          ""
        )}
      {props.isLoading
        ? (
          <Spinner animation="border" role="status">
            <span className="sr-only">Fetching Data</span>
          </Spinner>
        )
        : probes.length
        ? (
          props.rawFrameToggle
            ? (
              <div>
                {probes.map((element, key) => {
                  return (
                    <div id="raw" className="col-12">
                      <p>
                        key={key}>{JSON.stringify(element)}
                      </p>
                    </div>
                  );
                  // return (
                  //   <JSONPretty
                  //     id="json-pretty"
                  //     key={key}
                  //     data={element}
                  //     style={{ fontSize: "1.1em" }}
                  //     mainStyle="padding:1em"
                  //     valueStyle="font-size:1.5em"
                  //   ></JSONPretty>
                  // );
                })}
              </div>
            )
            : (
              <div className="content">
                <Row>
                  <Col lg="4">
                    <Card>
                      <CardHeader>
                        <h5 className="card-category">Select Date</h5>
                        <CardTitle tag="h4">
                          <DatePicker
                            className="ml-6"
                            placeholderText="click to select date"
                            // showTimeSelect
                            selected={moment(props.piDataFileRequestName)
                              .toDate()}
                            onChange={props.datePickerHandler}
                            // timeFormat="h:mm aa"
                            // timeIntervals={60}
                            // timeCaption="time"
                            // minDate={moment()
                            //   .subtract(1, "week")
                            //   .toDate()}
                            dateFormat="MMMM d, yyyy"
                            maxDate={moment().toDate()}
                          />
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Col>
                  <Col lg="4">
                    <Card className="card-chart">
                      <CardHeader>
                        <h5 className="card-category">No.of Directed Probes</h5>
                        <CardTitle tag="h3">{directedProbePingCount}</CardTitle>
                      </CardHeader>
                    </Card>
                  </Col>
                  <Col lg="4">
                    <Card className="card-chart">
                      <CardHeader>
                        <h5 className="card-category">No.of Null Probes</h5>
                        <CardTitle tag="h3">{nullProbePingCount}</CardTitle>
                      </CardHeader>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col md="10">
                    <Card className="pitable">
                      <MDBDataTable
                        entriesOptions={[20, 50, 100, 200, 500]}
                        maxHeight="325px"
                        pagesAmount={5}
                        noBottomColumns
                        striped
                        bordered
                        hover
                        data={data}
                        scrollX
                        scrollY
                        entries={20}
                        fixed
                      />
                    </Card>
                  </Col>
                  <Col lg="2">
                    <Card className="card-chart ssid">
                      <CardHeader>
                        <h5 className="card-category">Unique SSID</h5>
                        <CardTitle tag="p" className="ssid">
                          <ul>{listItems}</ul>
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Col>
                </Row>
              </div>
            )
        )
        : (
          <div>
            <Row>
              <Col lg="3">
                <Card>
                  <CardHeader>
                    <h5 className="card-category">Select Date</h5>
                    <CardTitle tag="h3">
                      <DatePicker
                        placeholderText="click to select date"
                        // showTimeSelect
                        selected={moment(props.piDataFileRequestName).toDate()}
                        onChange={props.datePickerHandler}
                        // timeFormat="h:mm aa"
                        // timeIntervals={60}
                        // timeCaption="time"
                        // minDate={moment()
                        //   .subtract(1, "week")
                        //   .toDate()}
                        dateFormat="MMMM d, yyyy"
                        maxDate={moment().toDate()}
                      />
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg="3">
                <h1>
                  No Content
                  {/* <Badge variant="dark">No Content</Badge> */}
                </h1>
              </Col>
            </Row>
          </div>
        )}
      {/* {console.log(props.probes)} */}
    </div>
  );
};

export default Sniff;
