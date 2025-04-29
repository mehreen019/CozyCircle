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
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [showInvite, setShowInvite] = useState(false);

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

  const getMembershipBackground = (membership) => {
    switch (membership) {
      case 'GOLD': return 'linear-gradient(135deg, #FFD700 0%, #FFC107 100%)';
      case 'SILVER': return 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)';
      case 'BRONZE': return 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)';
      default: return 'linear-gradient(135deg, #6c757d 0%, #495057 100%)';
    }
  };

  const handleViewInvite = (membership) => {
    setSelectedMembership(membership);
    setShowInvite(true);
  };

  const closeInviteModal = () => {
    setShowInvite(false);
    setSelectedMembership(null);
  };

  // Render invite card modal
  const renderInviteModal = () => {
    if (!selectedMembership) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          width: '350px',
          height: '550px',
          background: getMembershipBackground(selectedMembership.membership),
          borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <button 
            onClick={closeInviteModal}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(255,255,255,0.3)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            ✕
          </button>
          
          {/* Top decoration */}
          <div style={{
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderBottomLeftRadius: '100%',
            borderBottomRightRadius: '100%',
            marginBottom: '20px'
          }}></div>
          
          {/* Logo/Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'white',
            margin: '-50px auto 10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '40px',
            fontWeight: 'bold',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            color: selectedMembership.membership === 'GOLD' ? '#FFD700' : 
                  selectedMembership.membership === 'SILVER' ? '#C0C0C0' :
                  selectedMembership.membership === 'BRONZE' ? '#CD7F32' : '#6c757d'
          }}>
            {selectedMembership.membership.charAt(0)}
          </div>
          
          {/* Event Title */}
          <h2 style={{
            textAlign: 'center',
            color: selectedMembership.membership === 'GOLD' || selectedMembership.membership === 'SILVER' ? 'black' : 'white',
            margin: '10px 0 5px',
            padding: '0 15px',
            fontSize: '24px'
          }}>
            {selectedMembership.eventName || `Event #${selectedMembership.eventId}`}
          </h2>
          
          {/* Membership Level */}
          <div style={{
            textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.2)',
            margin: '10px auto',
            padding: '5px 20px',
            borderRadius: '20px',
            width: 'fit-content',
            fontWeight: 'bold',
            color: selectedMembership.membership === 'GOLD' || selectedMembership.membership === 'SILVER' ? 'black' : 'white'
          }}>
            {selectedMembership.membership} MEMBER
          </div>
          
          {/* User Info Section */}
          <div style={{
            margin: '20px 30px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '20px',
            borderRadius: '10px',
            color: selectedMembership.membership === 'GOLD' || selectedMembership.membership === 'SILVER' ? 'black' : 'white'
          }}>
            <p style={{ margin: '5px 0', fontSize: '16px' }}>
              <strong>Name:</strong> {auth.user?.name || auth.user?.username}
            </p>
            <p style={{ margin: '5px 0', fontSize: '16px' }}>
              <strong>Username:</strong> {auth.user?.username}
            </p>
            <p style={{ margin: '5px 0', fontSize: '16px' }}>
              <strong>Email:</strong> {auth.user?.email}
            </p>
          </div>
          
          {/* QR Code Placeholder */}
          <div style={{
            width: '150px',
            height: '150px',
            margin: '10px auto 20px',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              fontSize: '12px',
              textAlign: 'center',
              color: '#555'
            }}>
              QR CODE<br/>
              <span style={{ fontSize: '10px' }}>Scan for verification</span>
            </div>
          </div>
        </div>
      </div>
    );
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

  // Render memberships tab with added View Invite button
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
                  <th>Invite</th>
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
                    <td>
                      <button 
                        onClick={() => handleViewInvite(membership)}
                        style={{
                          backgroundColor: '#AE9D99',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        View Invite
                      </button>
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
      
      {showInvite && renderInviteModal()}
    </div>
  );
};

export default UserProfile; 