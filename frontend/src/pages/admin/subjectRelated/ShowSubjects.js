import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import BookIcon from '@mui/icons-material/Book';
import ClassIcon from '@mui/icons-material/Class';
import TimerIcon from '@mui/icons-material/Timer';
import { InputBase } from '@mui/material';
import Popup from '../../../components/Popup';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const COLORS = ['#4facfe', '#667eea', '#43e97b', '#f5576c', '#f093fb', '#fa8231', '#764ba2'];

const ShowSubjects = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user);
    const [search, setSearch] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    const deleteHandler = () => {
        setMessage("Sorry the delete function has been disabled for now.");
        setShowPopup(true);
    };

    const filtered = subjectsList && subjectsList.length > 0
        ? subjectsList.filter(s =>
            s.subName.toLowerCase().includes(search.toLowerCase()) ||
            s.sclassName?.sclassName?.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    if (loading) return <LoadingText>Loading subjects...</LoadingText>;

    if (response) return (
        <EmptyState>
            <EmptyIcon>📚</EmptyIcon>
            <EmptyTitle>No Subjects Yet</EmptyTitle>
            <EmptySubtitle>Add subjects to your classes to get started</EmptySubtitle>
            <AddButton onClick={() => navigate("/Admin/subjects/chooseclass")}>
                <PostAddIcon sx={{ mr: 1 }} /> Add Subject
            </AddButton>
        </EmptyState>
    );

    return (
        <PageWrapper>
            <PageHeader>
                <HeaderLeft>
                    <PageTitle>📚 Subjects</PageTitle>
                    <TotalBadge>{subjectsList?.length || 0} Total</TotalBadge>
                </HeaderLeft>
                <HeaderRight>
                    <SearchBox>
                        <SearchIcon sx={{ color: '#aaa', mr: 1, fontSize: 20 }} />
                        <InputBase
                            placeholder="Search subjects..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            sx={{ fontSize: '0.9rem', flex: 1 }}
                        />
                    </SearchBox>
                    <AddButton onClick={() => navigate("/Admin/subjects/chooseclass")}>
                        <PostAddIcon sx={{ mr: 1, fontSize: 18 }} /> Add Subject
                    </AddButton>
                </HeaderRight>
            </PageHeader>

            <SubjectsGrid>
                {filtered.length > 0 ? filtered.map((subject, index) => {
                    const color = COLORS[index % COLORS.length];
                    return (
                        <SubjectCard key={subject._id} delay={index * 0.05} color={color}>
                            <CardTop color={color}>
                                <SubjectEmoji>📖</SubjectEmoji>
                                <DeleteBtn onClick={() => deleteHandler()}>
                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                </DeleteBtn>
                                <SubjectCode color={color}>{subject.subCode}</SubjectCode>
                            </CardTop>
                            <CardBody>
                                <SubjectName>{subject.subName}</SubjectName>
                                <MetaGrid>
                                    <MetaItem>
                                        <MetaIcon color="#4facfe">
                                            <ClassIcon sx={{ fontSize: 14 }} />
                                        </MetaIcon>
                                        <MetaText>{subject.sclassName?.sclassName}</MetaText>
                                    </MetaItem>
                                    <MetaItem>
                                        <MetaIcon color="#43e97b">
                                            <TimerIcon sx={{ fontSize: 14 }} />
                                        </MetaIcon>
                                        <MetaText>{subject.sessions} Sessions</MetaText>
                                    </MetaItem>
                                </MetaGrid>
                                <ViewBtn
                                    color={color}
                                    onClick={() => navigate(`/Admin/subjects/subject/${subject.sclassName._id}/${subject._id}`)}
                                >
                                    <VisibilityIcon sx={{ fontSize: 15, mr: 0.5 }} /> View Details
                                </ViewBtn>
                            </CardBody>
                        </SubjectCard>
                    );
                }) : (
                    <NoResults>No subjects match your search 🔍</NoResults>
                )}
            </SubjectsGrid>
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
    background: linear-gradient(135deg, #4facfe, #00f2fe);
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
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(79,172,254,0.4);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(79,172,254,0.5);
    }
`;

const SubjectsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
`;

const SubjectCard = styled.div`
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    animation: ${fadeUp} 0.5s ease ${props => props.delay || 0}s both;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.12);
    }
`;

const CardTop = styled.div`
    background: ${props => props.color}18;
    padding: 28px 20px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`;

const SubjectEmoji = styled.div`
    font-size: 2.2rem;
    margin-bottom: 10px;
`;

const DeleteBtn = styled.button`
    position: absolute;
    top: 12px;
    right: 12px;
    background: #fff0f0;
    border: none;
    border-radius: 8px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #f5576c;
    transition: all 0.2s;

    &:hover { background: #f5576c; color: white; }
`;

const SubjectCode = styled.span`
    background: ${props => props.color};
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 3px 12px;
    border-radius: 20px;
    letter-spacing: 0.5px;
`;

const CardBody = styled.div`
    padding: 16px 20px 20px;
`;

const SubjectName = styled.h3`
    font-size: 1rem;
    font-weight: 800;
    color: #1a1a2e;
    margin: 0 0 14px 0;
    text-align: center;
`;

const MetaGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 16px;
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const MetaIcon = styled.div`
    width: 26px;
    height: 26px;
    border-radius: 6px;
    background: ${props => props.color}22;
    color: ${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const MetaText = styled.span`
    font-size: 0.85rem;
    font-weight: 600;
    color: #444;
`;

const ViewBtn = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.color}18;
    color: ${props => props.color};
    border: 2px solid ${props => props.color}33;
    border-radius: 12px;
    padding: 10px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${props => props.color};
        color: white;
        border-color: ${props => props.color};
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

export default ShowSubjects;