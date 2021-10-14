import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { Routes } from "../routes";

// pages
import ZealHome from "./ZealHome"
import DashboardOverview from "./dashboard/DashboardOverview";
import Gotcha from "./individual/Gotcha";
import Notes from "./Notes";
import Calender from "./Calender";
import SearchTeammates from "./individual/SearchTeammates";
import Transactions from "./Transactions";
import Profile from "./Profile";
import FAQ from "./FAQ";
import BootstrapTables from "./tables/BootstrapTables";
import Signin from "./authentication/Signin";
import Signup from "./authentication/Signup";
import ForgotPassword from "./authentication/ForgotPassword";
import ResetPassword from "./authentication/ResetPassword";
import Lock from "./authentication/Lock";
import NotFoundPage from "./authentication/NotFound";
import ServerError from "./authentication/ServerError";
import Chat from "./Chat";
import ParticipantEvents from "./events/ParticipantEvents";
import OrganizerEvents from "./events/OrganizerEvents"
import ViewParticipateEvent from './events/ViewParticipateEvent';
import ViewOrganizerPastEvent from './events/ViewOrganizerPastEvent';
import OrganizerEventDashboard from './events/OrganizerEventDashboard';
import ViewParticipantPastEvent from './events/ViewParticipantPastEvent';
import ParticipantEventDashboard from './events/ParticipantEventDashboard';
import ParticipantTeamOwnerDetails from './events/ParticipantTeamOwnerDetails';
import TeamVisualizer from './events/TeamVisualizer';

// components
import Sidebar from "../components/Sidebar";
import Preloader from "../components/Preloader";
import Accordion from "./components/Accordion";
import Alerts from "./components/Alerts";
import Badges from "./components/Badges";
import Breadcrumbs from "./components/Breadcrumbs";
import Buttons from "./components/Buttons";
import Forms from "./components/Forms";
import Modals from "./components/Modals";
import Navs from "./components/Navs";
import Navbars from "./components/Navbars";
import Pagination from "./components/Pagination";
import Popovers from "./components/Popovers";
import Progress from "./components/Progress";
import Tables from "./components/Tables";
import Tabs from "./components/Tabs";
import Tooltips from "./components/Tooltips";
import Toasts from "./components/Toasts";

const RouteWithLoader = ({ component: Component, componentProps, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route {...rest} render={props => (<> <Preloader show={loaded ? false : true} /> <Component {...props} componentProps={componentProps} /> </>)} />
  );
};

const RouteWithSidebar = ({ component: Component, componentProps, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  return (
    <Route {...rest} render={props => (
      <>
        <Preloader show={loaded ? false : true} />
        <Sidebar />
        <main className="content">
          {/* <Navbar /> */}
          <Component {...props} componentProps={componentProps} />
        </main>
      </>
    )}
    />
  );
};

export default (props) => {
  const [userCredentials, setCredentials] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setCredentials(foundUser)
      history.push(Routes.Profile.path)
    }
  }, []);

  const changeCred = (key, value) => {
    var backup = userCredentials;
    backup.user[key] = value;
    setCredentials(backup);
  }

  const render_protect_pages = () => {
    if (userCredentials == null) {
      return <Redirect to={Routes.Signin.path} />
    }
    else {
      const pages = [
        <Route exact path={Routes.TeamVisualizer.path} component={TeamVisualizer} />,
        <RouteWithSidebar exact path={Routes.SearchTeammates.path} component={SearchTeammates} />,
        <RouteWithSidebar exact path={Routes.Gotcha.path} component={Gotcha} componentProps={{ credentials: userCredentials, redirect_history: history }} />,
        <RouteWithSidebar exact path={Routes.Notes.path} component={Notes} componentProps={{ credentials: userCredentials, redirect_history: history }} />,
        <RouteWithSidebar exact path={Routes.Calender.path} component={Calender} componentProps={{ credentials: userCredentials, redirect_history: history }} />,
        <RouteWithSidebar exact path={Routes.DashboardOverview.path} component={DashboardOverview} />,
        <RouteWithSidebar exact path={Routes.Profile.path} component={Profile} componentProps={{ credentials: userCredentials, redirect_history: history, changeCredentials: changeCred }} />,
        <RouteWithSidebar exact path={Routes.Chat.path} component={Chat} />,
        <RouteWithSidebar exact path={Routes.ParticipantEvents.path} component={ParticipantEvents} componentProps={{ credentials: userCredentials, redirect_history: history }} />,
        <RouteWithSidebar exact path={Routes.ViewParticipateEvent.path} component={ViewParticipateEvent} componentProps={{ credentials: userCredentials, redirect_history: history }} />,
        <RouteWithSidebar exact path={Routes.OrganizerEvents.path} component={OrganizerEvents} componentProps={{ credentials: userCredentials, redirect_history: history }} />,
        <RouteWithSidebar exact path={Routes.ViewOrganizerPastEvent.path} component={ViewOrganizerPastEvent} componentProps={{ credentials: userCredentials, redirect_history: history }} />,
        <RouteWithSidebar exact path={Routes.OrganizerEventDashboard.path} component={OrganizerEventDashboard} componentProps={{ credentials: userCredentials, redirect_history: history }} />,
        <RouteWithSidebar exact path={Routes.ViewParticipantPastEvent.path} component={ViewParticipantPastEvent} componentProps={{ credentials: userCredentials, redirect_history: history }} />,
        <RouteWithSidebar exact path={Routes.ParticipantEventDashboard.path} component={ParticipantEventDashboard} componentProps={{ credentials: userCredentials, redirect_history: history }} />,
        <RouteWithSidebar exact path={Routes.ParticipantTeamOwnerDetails.path} component={ParticipantTeamOwnerDetails} componentProps={{ credentials: userCredentials, redirect_history: history }} />,
        <RouteWithSidebar exact path={Routes.Transactions.path} component={Transactions} />,
        <RouteWithSidebar exact path={Routes.BootstrapTables.path} component={BootstrapTables} />
      ]
      return pages
    }
  }

  return (
    <Switch>
      <RouteWithLoader exact path={Routes.ZealHome.path} component={ZealHome} />
      <RouteWithLoader exact path={Routes.FAQ.path} component={FAQ} />
      <RouteWithLoader exact path={Routes.Signin.path} component={Signin} componentProps={{ updateCredentials: setCredentials, redirect_history: history }} />
      <RouteWithLoader exact path={Routes.Signup.path} component={Signup} componentProps={{ updateCredentials: setCredentials, redirect_history: history }} />


      <RouteWithLoader exact path={Routes.ForgotPassword.path} component={ForgotPassword} />
      <RouteWithLoader exact path={Routes.ResetPassword.path} component={ResetPassword} />
      <RouteWithLoader exact path={Routes.Lock.path} component={Lock} />
      <RouteWithLoader exact path={Routes.NotFound.path} component={NotFoundPage} />
      <RouteWithLoader exact path={Routes.ServerError.path} component={ServerError} />

      {render_protect_pages()}

      {/* components */}
      <RouteWithSidebar exact path={Routes.Accordions.path} component={Accordion} />
      <RouteWithSidebar exact path={Routes.Alerts.path} component={Alerts} />
      <RouteWithSidebar exact path={Routes.Badges.path} component={Badges} />
      <RouteWithSidebar exact path={Routes.Breadcrumbs.path} component={Breadcrumbs} />
      <RouteWithSidebar exact path={Routes.Buttons.path} component={Buttons} />
      <RouteWithSidebar exact path={Routes.Forms.path} component={Forms} />
      <RouteWithSidebar exact path={Routes.Modals.path} component={Modals} />
      <RouteWithSidebar exact path={Routes.Navs.path} component={Navs} />
      <RouteWithSidebar exact path={Routes.Navbars.path} component={Navbars} />
      <RouteWithSidebar exact path={Routes.Pagination.path} component={Pagination} />
      <RouteWithSidebar exact path={Routes.Popovers.path} component={Popovers} />
      <RouteWithSidebar exact path={Routes.Progress.path} component={Progress} />
      <RouteWithSidebar exact path={Routes.Tables.path} component={Tables} />
      <RouteWithSidebar exact path={Routes.Tabs.path} component={Tabs} />
      <RouteWithSidebar exact path={Routes.Tooltips.path} component={Tooltips} />
      <RouteWithSidebar exact path={Routes.Toasts.path} component={Toasts} />
      <Redirect to={Routes.NotFound.path} />
    </Switch>
  )
};
