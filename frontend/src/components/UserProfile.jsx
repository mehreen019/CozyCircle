import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserScore, getUserMemberships, getUserStats } from '../helpers/api_communicator';

const UserProfile = () => {
  const [userScore, setUserScore] = useState(null);
  const [userMemberships, setUserMemberships] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (!auth?.user) {
      return navigate("*");
    } else {
      loadUserData();
    }
  }, [auth, navigate]);

  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (auth.user && auth.user.email) {
        // Fetch all user data in parallel
        const [scoreData, membershipsData, statsData] = await Promise.all([
          getUserScore(auth.user.email),
          getUserMemberships(auth.user.email),
          getUserStats(auth.user.email)
        ]);
        
        setUserScore(scoreData);
        setUserMemberships(membershipsData);
        setUserStats(statsData);
      } else {
        setError("User email not available");
      }
    } catch (err) {
      console.error("Error loading user data:", err);
      setError(err.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const getMembershipColor = (membership) => {
    switch (membership) {
      case 'GOLD': return '#FFD700';
      case 'SILVER': return '#C0C0C0';
      case 'BRONZE': return '#CD7F32';
      default: return '#6c757d';
    }
  };

  // Render tabs UI
  const renderTabs = () => (
    <div className="tabs" style={{ marginBottom: '20px' }}>
      <button 
        onClick={() => setActiveTab('overview')}
        style={{ 
          padding: '10px 20px', 
          marginRight: '10px', 
          backgroundColor: activeTab === 'overview' ? '#AE9D99' : '#eee',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Overview
      </button>
      <button 
        onClick={() => setActiveTab('memberships')}
        style={{ 
          padding: '10px 20px', 
          marginRight: '10px',
          backgroundColor: activeTab === 'memberships' ? '#AE9D99' : '#eee',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Memberships
      </button>
      <button 
        onClick={() => setActiveTab('stats')}
        style={{ 
          padding: '10px 20px',
          backgroundColor: activeTab === 'stats' ? '#AE9D99' : '#eee',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Statistics
      </button>
    </div>
  );

  // Render overview tab
  const renderOverview = () => (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">User Profile</h3>
        {userScore && (
          <div>
            <p><strong>Username:</strong> {userScore.username}</p>
            <p><strong>User ID:</strong> {userScore.userId}</p>
            <div className="score-display" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '20px',
              marginBottom: '20px'
            }}>
              <h4>Your Score</h4>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                backgroundColor: '#AE9D99',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontSize: '48px',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                {userScore.score}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render memberships tab
  const renderMemberships = () => (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Your Memberships</h3>
        {userMemberships.length === 0 ? (
          <p className="text-center">You don't have any memberships yet. Register for events to earn memberships!</p>
        ) : (
          <div className="table-responsive">
            <table className="table border">
              <thead className="thead-light">
                <tr>
                  <th>Event Name</th>
                  <th>Membership Level</th>
                </tr>
              </thead>
              <tbody>
                {userMemberships.map((membership, index) => (
                  <tr key={index}>
                    <td>{membership.eventName || `Event #${membership.eventId}`}</td>
                    <td>
                      <span style={{
                        backgroundColor: getMembershipColor(membership.membership),
                        padding: '5px 10px',
                        borderRadius: '20px',
                        color: membership.membership === 'GOLD' || membership.membership === 'SILVER' ? 'black' : 'white',
                        fontWeight: 'bold'
                      }}>
                        {membership.membership || 'BASIC'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // Render stats tab
  const renderStats = () => (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Your Activity</h3>
        {userStats && (
          <div className="row">
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Events Created</h5>
                  <p className="card-text" style={{ fontSize: '32px', textAlign: 'center' }}>{userStats.eventsCreated}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Events Attended</h5>
                  <p className="card-text" style={{ fontSize: '32px', textAlign: 'center' }}>{userStats.eventsAttended}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Ratings Provided</h5>
                  <p className="card-text" style={{ fontSize: '32px', textAlign: 'center' }}>{userStats.ratingsProvided}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Score</h5>
                  <p className="card-text" style={{ fontSize: '32px', textAlign: 'center' }}>{userStats.score}</p>
                </div>
              </div>
            </div>
            
            {userStats.membershipDistribution && Object.keys(userStats.membershipDistribution).length > 0 && (
              <div className="col-12 mt-3">
                <h5>Membership Distribution</h5>
                <div style={{ display: 'flex', marginTop: '15px' }}>
                  {Object.entries(userStats.membershipDistribution).map(([level, count]) => (
                    <div key={level} style={{ 
                      flex: count, 
                      backgroundColor: getMembershipColor(level), 
                      padding: '15px 0',
                      margin: '0 2px',
                      textAlign: 'center',
                      color: level === 'GOLD' || level === 'SILVER' ? 'black' : 'white',
                      fontWeight: 'bold',
                      borderRadius: '4px'
                    }}>
                      {level}: {count}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 style={{color: 'black', marginBottom:'24px'}}>User Profile</h2>
      
      {renderTabs()}
      
      <div className="tab-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'memberships' && renderMemberships()}
        {activeTab === 'stats' && renderStats()}
      </div>
    </div>
  );
};

export default UserProfile; 