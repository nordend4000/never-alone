import Signup from './Signup'
import Home from '../pages/Home'
import About from '../pages/About'
import Dashboard from '../pages/Dashboard'
import Login from './Login'
import PrivateRoute from './PrivateRoute'
import ForgotPassword from './ForgotPassword'
import Profile from './Profile'
import Trips from './Trips'
import EditTrip from './EditTrip'
import Blog from './Blog'
import EditBlog from './EditBlog'
import Post from '../pages/Post'
import User from '../pages/User'
import Contact from '../pages/Contact'
import OpenMap from '../pages/OpenMap'
import NotFound from '../pages/NotFound'
import TermsConditions from '../pages/TermsConditions'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import Comments from './Comments'
import DeleteMessage from './DeleteMessage'
import DeleteComment from './DeleteComment'
import { AuthProvider } from '../contexts/AuthContext'
import ScrollToTop from '../contexts/ScrollToTop'
import { BrowserRouter  as Router, Switch, Route } from 'react-router-dom'

function App() {
  return (
          <Router>
            <AuthProvider>
            <ScrollToTop />
              <Switch>
                <Route exact path="/" component={Home}/>
                <PrivateRoute path="/dashboard" component={Dashboard}/>
                <PrivateRoute path="/profile" component={Profile}/>
                <PrivateRoute path="/trips" component={Trips}/>
                <PrivateRoute path="/blog" component={Blog}/>
                <PrivateRoute path="/post" component={Comments}/>
                <PrivateRoute path="/new" component={Post}/>
                <PrivateRoute path="/user" component={User}/>
                <PrivateRoute path="/map" component={OpenMap}/>
                <PrivateRoute path="/editTrip" component={EditTrip}/>
                <PrivateRoute path="/deleteMessage" component={DeleteMessage}/>
                <PrivateRoute path="/deleteComment" component={DeleteComment}/>
                <PrivateRoute path="/editBlog" component={EditBlog}/>
                <Route path="/signup" component={Signup}/>
                <Route path="/login" component={Login}/>
                <Route path="/forgot-password" component={ForgotPassword}/>
                <Route path="/about" component={About}/>
                <Route path="/contact" component={Contact}/>
                <Route path="/privacy-policy" component={PrivacyPolicy}/>
                <Route path="/terms-and-conditions" component={TermsConditions}/>
                <Route component={NotFound}/>
              </Switch>
            </AuthProvider>
          </Router>
  );
}

export default App;
