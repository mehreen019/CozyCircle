import { useState, useEffect } from 'react';
import { getUserLeaderboard } from '../helpers/api_communicator';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (!auth?.user) {
      return navigate("*");
    } else {
      loadLeaderboard();
    }
  }, [auth, navigate]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const leaderboardData = await getUserLeaderboard();
      setLeaderboard(leaderboardData);
    } catch (err) {
      console.error("Error loading leaderboard:", err);
      setError(err.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1: return { backgroundColor: '#FFD700', color: 'black' }; // Gold
      case 2: return { backgroundColor: '#C0C0C0', color: 'black' }; // Silver
      case 3: return { backgroundColor: '#CD7F32', color: 'white' }; // Bronze
      default: return { backgroundColor: '#f8f9fa', color: 'black' };
    }
  };

  const highlightCurrentUser = (username) => {
    return auth.user && auth.user.username === username;
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 style={{color: 'black', marginBottom:'24px'}}>User Leaderboard</h2>
      
      <div className="card">
        <div className="card-body">
          <h3 className="card-title mb-4">Top Users by Score</h3>
          
          {leaderboard.length === 0 ? (
            <p className="text-center">No users found in the leaderboard.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="thead-light">
                  <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user) => (
                    <tr key={user.userId} style={highlightCurrentUser(user.username) ? { backgroundColor: '#e3f2fd' } : {}}>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          textAlign: 'center',
                          lineHeight: '30px',
                          fontWeight: 'bold',
                          ...getRankStyle(user.rank)
                        }}>
                          {user.rank}
                        </span>
                      </td>
                      <td>{user.username}</td>
                      <td>{user.name}</td>
                      <td>
                        <span style={{
                          fontWeight: 'bold',
                          color: '#8A7B77'
                        }}>
                          {user.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-4">
            <h5>How Scores are Calculated</h5>
            <ul>
              <li><strong>Creating Events:</strong> +5 points per event</li>
              <li><strong>Attending Events:</strong> +3 points per event</li>
              <li><strong>Rating Events:</strong> +2 points per rating</li>
            </ul>
            <p>The higher your score, the better membership levels you&apos;ll receive when registering for events!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 