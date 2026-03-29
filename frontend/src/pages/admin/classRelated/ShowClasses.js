import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { InputBase } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import AddCardIcon from '@mui/icons-material/AddCard';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import Popup from '../../../components/Popup';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa8231 0%, #f5576c 100%)',
  'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
  'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
];

const SHADOWS = [
  'rgba(102,126,234,0.4)',
  'rgba(245,87,108,0.4)',
  'rgba(79,172,254,0.4)',
  'rgba(67,233,123,0.4)',
  'rgba(250,130,49,0.4)',
  'rgba(162,155,254,0.4)',
  'rgba(253,121,168,0.4)',
];

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sclassesList, loading, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector(state => state.user);
  const [search, setSearch] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const deleteHandler = () => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const filtered = sclassesList && sclassesList.length > 0
    ? sclassesList.filter(c =>
      c.sclassName.toLowerCase().includes(search.toLowerCase())
    )
    : [];

  if (loading) return <LoadingText>Loading classes...</LoadingText>;

  if (getresponse) return (
    <EmptyState>
      <EmptyIcon>🏫</EmptyIcon>
      <EmptyTitle>No Classes Yet</EmptyTitle>
      <EmptySubtitle>Create your first class to get started</EmptySubtitle>
      <AddButton onClick={() => navigate("/Admin/addclass")}>
        <AddCardIcon sx={{ mr: 1 }} /> Add Class
      </AddButton>
    </EmptyState>
  );

  return (
    <PageWrapper>
      <PageHeader>
        <HeaderLeft>
          <PageTitle>🏫 Classes</PageTitle>
          <TotalBadge>{sclassesList?.length || 0} Total</TotalBadge>
        </HeaderLeft>
        <HeaderRight>
          <SearchBox>
            <SearchIcon sx={{ color: '#aaa', mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder="Search classes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ fontSize: '0.9rem', flex: 1 }}
            />
          </SearchBox>
          <AddButton onClick={() => navigate("/Admin/addclass")}>
            <AddCardIcon sx={{ mr: 1, fontSize: 18 }} /> Add Class
          </AddButton>
        </HeaderRight>
      </PageHeader>

      <ClassesGrid>
        {filtered.length > 0 ? filtered.map((sclass, index) => {
          const gradient = GRADIENTS[index % GRADIENTS.length];
          const shadow = SHADOWS[index % SHADOWS.length];
          return (
            <ClassCard key={sclass._id} delay={index * 0.06} shadow={shadow}>
              <CardBanner gradient={gradient}>
                <ClassEmoji>🎓</ClassEmoji>
                <DeleteBtn onClick={() => deleteHandler()}>
                  <DeleteIcon sx={{ fontSize: 16 }} />
                </DeleteBtn>
                <ClassName>{sclass.sclassName}</ClassName>
              </CardBanner>
              <CardBody>
                <QuickActions>
                  <QuickBtn
                    color="#667eea"
                    onClick={() => navigate("/Admin/classes/class/" + sclass._id)}
                  >
                    <VisibilityIcon sx={{ fontSize: 15, mr: 0.5 }} /> View
                  </QuickBtn>
                  <QuickBtn
                    color="#43e97b"
                    onClick={() => navigate("/Admin/class/addstudents/" + sclass._id)}
                  >
                    <PersonAddAlt1Icon sx={{ fontSize: 15, mr: 0.5 }} /> Students
                  </QuickBtn>
                  <QuickBtn
                    color="#f5576c"
                    onClick={() => navigate("/Admin/addsubject/" + sclass._id)}
                  >
                    <PostAddIcon sx={{ fontSize: 15, mr: 0.5 }} /> Subjects
                  </QuickBtn>
                </QuickActions>
              </CardBody>
            </ClassCard>
          );
        }) : (
          <NoResults>No classes match your search 🔍</NoResults>
        )}
      </ClassesGrid>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </PageWrapper>
  );
};

// ── Styled Components ──────────────────────────────────────────

const PageWrapper = styled.div`
    padding: 24px;
    background: #f0f2f5;
    min-height: 100vh;
`;

const PageHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 16px;
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
`;

const PageTitle = styled.h1`
    font-size: 1.6rem;
    font-weight: 800;
    color: #1a1a2e;
    margin: 0;
`;

const TotalBadge = styled.span`
    background: linear-gradient(135deg, #43e97b, #38f9d7);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
`;

const SearchBox = styled.div`
    display: flex;
    align-items: center;
    background: white;
    border-radius: 12px;
    padding: 8px 16px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    min-width: 220px;
`;

const AddButton = styled.button`
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #43e97b, #38f9d7);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(67,233,123,0.4);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(67,233,123,0.5);
    }
`;

const ClassesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
`;

const ClassCard = styled.div`
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px ${props => props.shadow || 'rgba(0,0,0,0.06)'};
    animation: ${fadeUp} 0.5s ease ${props => props.delay || 0}s both;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 16px 35px ${props => props.shadow || 'rgba(0,0,0,0.12)'};
    }
`;

const CardBanner = styled.div`
    background: ${props => props.gradient};
    padding: 32px 20px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`;

const ClassEmoji = styled.div`
    font-size: 2.5rem;
    margin-bottom: 10px;
`;

const DeleteBtn = styled.button`
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255,255,255,0.2);
    border: none;
    border-radius: 8px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: all 0.2s;

    &:hover { background: rgba(255,255,255,0.35); }
`;

const ClassName = styled.h3`
    color: white;
    font-size: 1.2rem;
    font-weight: 800;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const CardBody = styled.div`
    padding: 16px;
`;

const QuickActions = styled.div`
    display: flex;
    gap: 8px;
`;

const QuickBtn = styled.button`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.color}15;
    color: ${props => props.color};
    border: none;
    border-radius: 10px;
    padding: 9px 4px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${props => props.color};
        color: white;
    }
`;

const LoadingText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    font-size: 1.1rem;
    color: #888;
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    text-align: center;
`;

const EmptyIcon = styled.div`font-size: 4rem; margin-bottom: 16px;`;
const EmptyTitle = styled.h2`font-size: 1.4rem; color: #333; margin: 0 0 8px 0;`;
const EmptySubtitle = styled.p`color: #aaa; margin: 0 0 24px 0;`;
const NoResults = styled.div`
    grid-column: 1/-1;
    text-align: center;
    padding: 60px;
    color: #aaa;
    font-size: 1rem;
`;

export default ShowClasses;