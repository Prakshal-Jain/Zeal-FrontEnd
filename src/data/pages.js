
import OverviewImg from "../assets/img/pages/overview.jpg";
import TransactionsImg from "../assets/img/pages/transactions.jpg";
import SettingsImg from "../assets/img/pages/settings.jpg";
import SignInImg from "../assets/img/pages/sign-in.jpg";
import SignUpImg from "../assets/img/pages/sign-up.jpg";
import LockImg from "../assets/img/pages/lock.jpg";
import ForgotPasswordImg from "../assets/img/pages/forgot-password.jpg";
import ResetPasswordImg from "../assets/img/pages/reset-password.jpg";
import NotFoundImg from "../assets/img/pages/404.jpg";
import ServerErrorImg from "../assets/img/pages/500.jpg";

import { Routes } from "../routes";


export default [
    {
        "id": 1,
        "name": "Search Teammates",
        "image": OverviewImg,
        "link": Routes.SearchTeammates.path
    },
    {
        "id": 2,
        "name": "Overview",
        "image": OverviewImg,
        "link": Routes.DashboardOverview.path
    },
    {
        "id": 3,
        "name": "Transactions",
        "image": TransactionsImg,
        "link": Routes.Transactions.path
    },
    {
        "id": 4,
        "name": "Settings",
        "image": SettingsImg,
        "link": Routes.Settings.path
    },
    {
        "id": 5,
        "name": "Sign In",
        "image": SignInImg,
        "link": Routes.Signin
    },
    {
        "id": 6,
        "name": "Sign Up",
        "image": SignUpImg,
        "link": Routes.Signup.path
    },
    {
        "id": 7,
        "name": "Lock",
        "image": LockImg,
        "link": Routes.Lock.path
    },
    {
        "id": 8,
        "name": "Forgot password",
        "image": ForgotPasswordImg,
        "link": Routes.ForgotPassword.path
    },
    {
        "id": 9,
        "name": "Reset password",
        "image": ResetPasswordImg,
        "link": Routes.ResetPassword.path
    },
    {
        "id": 10,
        "name": "404",
        "image": NotFoundImg,
        "link": Routes.NotFound.path
    },
    {
        "id": 11,
        "name": "500",
        "image": ServerErrorImg,
        "link": Routes.ServerError.path
    }
];