import './App.css'
import Login from './components/Login'
import Signup from './components/Signup'
import NotFound from './components/NotFound'
import Dashboard from './components/Dashboard'
import { Home } from './components/Home'
import { Route, Routes } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Header from './components/Header'
import AddEvent from './components/AddEvent'
import EditEvent from './components/EditEvent'
import ViewEvent from './components/ViewEvent'
import CommonEvents from './components/CommonEvents'
import CommonViewEvent from './components/CommonView'
import AttendeeRegister from './components/RegisterUser'
import ExploreEvents from './components/ExploreEvents'
import TotalRatingsPage from './components/dummy'
import EventRankings from './components/EventRankings'
import EventAnalytics from './components/EventAnalytics'

import EventCategoryCount from './components/EventCategoryCount'
import UserProfile from './components/UserProfile'
import Leaderboard from './components/Leaderboard'
import WaitlistView from './components/WaitlistView'

function App() {

  console.log("ok")

  return (
    <main>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/allEvents" element={<CommonEvents/>} />
        <Route path="/viewCommonEvent" element={<CommonViewEvent/>} />
        <Route path="/registerAttendee" element={<AttendeeRegister/>} />

        <Route path="*" element={<NotFound/>}/>
        <Route path="/dashboard/" element={<Dashboard/>} />
        <Route path="/addEvent" element={<AddEvent/>} />
        <Route path="/editEvent" element={<EditEvent/>} />
        <Route path="/viewEvent" element={<ViewEvent/>} />
        <Route path="/ExploreEvent" element={<ExploreEvents/>} />
        <Route path="/count/:eventId" element={<TotalRatingsPage/>} />
        <Route path= "/events/category-counts" element={<EventCategoryCount/>} />
        <Route path='/:eventId/waitlist-view' element={<WaitlistView/>} />
       

        {/* New routes for event rankings and analytics */}
        <Route path="/events/rankings" element={<EventRankings/>} />
        <Route path="/events/analytics" element={<EventAnalytics/>} />
        
        {/* New routes for user profile and leaderboard */}
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/leaderboard" element={<Leaderboard/>} />
      </Routes>
    </main>
  )
}

export default App
