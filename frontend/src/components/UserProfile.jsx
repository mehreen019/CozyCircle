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
          backgroundColor: activeTab === 'memberships' ? '#AE9D99' : '#eee',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Memberships
      </button>
    </div>
  );

  // Render overview tab
  const renderOverview = () => (
    <div className="overview-container" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px'
    }}>
      {/* User Info Card */}
      <div className="card" style={{
        backgroundColor: '#F5F5F5',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#AE9D99',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '15px',
          color: 'white',
          fontSize: '40px',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          {userScore?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <h4 style={{ margin: '10px 0', color: '#333' }}>{userScore?.username}</h4>
        <p style={{ color: '#666', margin: '5px 0' }}>User ID: {userScore?.userId}</p>
      </div>

      {/* Score Card */}
      <div className="card" style={{
        backgroundColor: '#AE9D99',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center'
      }}>
        <h4 style={{ marginBottom: '15px', color: 'white' }}>Your Score</h4>
        <div style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '48px',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          {userScore?.score || 0}
        </div>
        <p style={{ marginTop: '15px', fontSize: '14px' }}>Keep engaging to boost your score!</p>
      </div>

      {/* Detailed Stats Card */}
      <div className="card" style={{
        backgroundColor: '#F5F5F5',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h4 style={{ marginBottom: '15px', color: '#333', textAlign: 'center' }}>Activity Insights</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{
            backgroundColor: '#AE9D99',
            color: 'white',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center'
          }}>
            <h6 style={{ margin: '0 0 5px 0' }}>Events Created</h6>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              {userStats?.eventsCreated || 0}
            </p>
          </div>
          <div style={{
            backgroundColor: '#AE9D99',
            color: 'white',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center'
          }}>
            <h6 style={{ margin: '0 0 5px 0' }}>Events Attended</h6>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              {userStats?.eventsAttended || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Membership Distribution Card */}
      {userStats?.membershipDistribution && Object.keys(userStats.membershipDistribution).length > 0 && (
        <div className="card" style={{
          backgroundColor: '#F5F5F5',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          gridColumn: 'span 2'
        }}>
          <h4 style={{ marginBottom: '15px', color: '#333', textAlign: 'center' }}>Membership Distribution</h4>
          <div style={{ display: 'flex', height: '50px' }}>
            {Object.entries(userStats.membershipDistribution).map(([level, count]) => (
              <div key={level} style={{ 
                flex: count, 
                backgroundColor: getMembershipColor(level), 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 2px',
                borderRadius: '4px',
                color: level === 'GOLD' || level === 'SILVER' ? 'black' : 'white',
                fontWeight: 'bold'
              }}>
                {level}: {count}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Stats Card */}
      <div className="card" style={{
        backgroundColor: '#F5F5F5',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h4 style={{ marginBottom: '15px', color: '#333', textAlign: 'center' }}>More Insights</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{
            backgroundColor: '#AE9D99',
            color: 'white',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center'
          }}>
            <h6 style={{ margin: '0 0 5px 0' }}>Ratings</h6>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              {userStats?.ratingsProvided || 0}
            </p>
          </div>
          <div style={{
            backgroundColor: '#AE9D99',
            color: 'white',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center'
          }}>
            <h6 style={{ margin: '0 0 5px 0' }}>Total Score</h6>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              {userStats?.score || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render memberships tab with added View Invite button
  const renderMemberships = () => (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Your Memberships</h3>
        {userMemberships.length === 0 ? (
          <p className="text-center">You don&apos;t have any memberships yet. Register for events to earn memberships!</p>
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
      </div>
      
      {showInvite && renderInviteModal()}
    </div>
  );
};

export default UserProfile; 