
import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChess, faChartLine, faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Breadcrumb } from '@themesberg/react-bootstrap';

import { CounterWidget, CircleChartWidget, BarChartWidget, TeamMembersWidget, ProgressTrackWidget, RankingWidget, SalesValueWidget, SalesValueWidgetPhone, AcquisitionWidget } from "../../components/Widgets";
import { PageVisitsTable } from "../../components/Tables";
import { trafficShares, totalOrders } from "../../data/charts";

class DashboardOverview extends Component {
  render() {
    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <div className="d-block mb-4 mb-md-0">
            <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
              <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
              <Breadcrumb.Item active>Overview</Breadcrumb.Item>
            </Breadcrumb>
            <h4>Overview</h4>
            <p className="mb-0">A self reflection tool for you!</p>
          </div>
        </div>

        <Row className="justify-content-md-center">
          <Col xs={12} className="mb-4 d-none d-sm-block">
            <SalesValueWidget
              title="Overall performance trend"
              value="10,567"
              percentage={10.57}
            />
          </Col>
          <Col xs={12} className="mb-4 d-sm-none">
            <SalesValueWidgetPhone
              title="Overall performance trend"
              value="10,567"
              percentage={10.57}
            />
          </Col>

          <Col xs={12} sm={6} xl={4} className="mb-4">
            <CounterWidget
              category="Connections"
              title="100k"
              period="Jan 1 - Apr 1"
              percentage={80.2}
              icon={faChartLine}
              iconColor="shape-secondary"
            />
          </Col>

          <Col xs={12} sm={6} xl={4} className="mb-4">
            <CounterWidget
              category="Event Participation"
              title="$43,594"
              period="Feb 1 - Apr 1"
              percentage={28.4}
              icon={faChess}
              iconColor="shape-tertiary"
            />
          </Col>

          <Col xs={12} sm={6} xl={4} className="mb-4">
            <CircleChartWidget
              title="Idea Performance"
              data={trafficShares} />
          </Col>
        </Row>

        <Row>
          <Col xs={12} xl={12} className="mb-4">
            <Row>
              <Col xs={12} xl={8} className="mb-4">
                <Row>
                  <Col xs={12} className="mb-4">
                    <PageVisitsTable />
                  </Col>

                  <Col xs={12} lg={6} className="mb-4">
                    <TeamMembersWidget />
                  </Col>

                  <Col xs={12} lg={6} className="mb-4">
                    <ProgressTrackWidget />
                  </Col>
                </Row>
              </Col>

              <Col xs={12} xl={4}>
                <Row>
                  <Col xs={12} className="mb-4">
                    <BarChartWidget
                      title="Total orders"
                      value={452}
                      percentage={18.2}
                      data={totalOrders} />
                  </Col>

                  <Col xs={12} className="px-0 mb-4">
                    <RankingWidget />
                  </Col>

                  <Col xs={12} className="px-0">
                    <AcquisitionWidget />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  };
}

export default DashboardOverview