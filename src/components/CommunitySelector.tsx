import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { selectSelectedCommunityId, setSelectedCommunityId } from '../store/appSlice';
import { fetchCommunities, Community } from '../apiServices/communitiesAPI';

const CommunitySelector = () => {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector(selectSelectedCommunityId);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunities()
      .then(setCommunities)
      .catch(() => setCommunities([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId && communities.length > 0) {
      dispatch(setSelectedCommunityId(communities[0].id));
    }
  }, [communities, selectedId, dispatch]);

  if (loading) return <div className="CommunitySelector">Loading communities...</div>;
  if (communities.length === 0) return <div className="CommunitySelector">No communities</div>;

  return (
    <div className="CommunitySelector" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <label htmlFor="community-select" style={{ fontWeight: 600 }}>Community:</label>
      <select
        id="community-select"
        value={selectedId}
        onChange={(e) => dispatch(setSelectedCommunityId(e.target.value))}
        style={{ padding: '6px 10px', minWidth: 200 }}
      >
        <option value="">Select community...</option>
        {communities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.CommunityName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CommunitySelector;
