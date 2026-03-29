import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import { InputBase } from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';

import ClassIcon from '@mui/icons-material/Class';
import BookIcon from '@mui/icons-material/Book';

import Popup from '../../../components/Popup';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const COLORS = ['#764ba2', '#f5576c', '#4facfe', '#43e97b', '#fa8231', '#667eea', '#f093fb'];

const ShowTeachers = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teachersList, loading, response } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);
    const [search, setSearch] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
    }, [currentUser._id, dispatch]);

    const deleteHandler = () => {
        setMessage("Sorry the delete function has been disabled for now.");
        setShowPopup(true);
    };

    const filtered = teachersList && teachersList.length > 0
        ? teachersList.filter(t =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            (t.teachSubject?.subName || '').toLowerCase().includes(search.toLowerCase())
        )
        : [];

    if (loading) return <LoadingText>Loading teachers...</LoadingText>;

    if (response) return (
        <EmptyState>
            <EmptyIcon>👩‍🏫</EmptyIcon>
            <EmptyTitle>No Teachers Yet</EmptyTitle>
            <EmptySubtitle>Add your first teacher to get started</EmptySubtitle>
            <AddButton onClick={() => navigate("/Admin/teachers/chooseclass")}>
                <PersonAddAlt1Icon sx={{ mr: 1 }} /> Add Teacher
            </AddButton>
        </EmptyState>
    );

    return (
        <PageWrapper>
            <PageHeader>
                <HeaderLeft>
                    <PageTitle>👩‍🏫 Teachers</PageTitle>
                    <TotalBadge>{teachersList?.length || 0} Total</TotalBadge>
                </HeaderLeft>
                <HeaderRight>
                    <SearchBox>
                        <SearchIcon sx={{ color: '#aaa', mr: 1, fontSize: 20 }} />
                        <InputBase
                            placeholder="Search teachers..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            sx={{ fontSize: '0.9rem', flex: 1 }}
                        />
                    </SearchBox>
                    <AddButton onClick={() => navigate("/Admin/teachers/chooseclass")}>
                        <PersonAddAlt1Icon sx={{ mr: 1, fontSize: 18 }} /> Add Teacher
                    </AddButton>
                </HeaderRight>
            </PageHeader>

            <TeachersGrid>
                {filtered.length > 0 ? filtered.map((teacher, index) => {
                    const color = COLORS[index % COLORS.length];
                    const initials = teacher.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    const hasSubject = teacher.teachSubject?.subName;
                    return (
                        <TeacherCard key={teacher._id} delay={index * 0.05} color={color}>
                            <CardTop color={color}>
                                <TeacherAvatar color={color}>{initials}</TeacherAvatar>
                                <DeleteBtn onClick={() => deleteHandler()}>
                                    <PersonRemoveIcon sx={{ fontSize: 16 }} />
                                </DeleteBtn>
                            </CardTop>
                            <CardBody>
                                <TeacherName>{teacher.name}</TeacherName>
                                <InfoGrid>
                                    <InfoItem>
                                        <InfoIcon color="#4facfe"><ClassIcon sx={{ fontSize: 14 }} /></InfoIcon>
                                        <InfoText>{teacher.teachSclass?.sclassName || 'N/A'}</InfoText>
                                    </InfoItem>
                                    <InfoItem>
                                        <InfoIcon color={hasSubject ? '#43e97b' : '#f5576c'}>
                                            <BookIcon sx={{ fontSize: 14 }} />
                                        </InfoIcon>
                                        {hasSubject ? (
                                            <InfoText>{hasSubject}</InfoText>
                                        ) : (
                                            <AssignBtn onClick={() =>
                                                navigate(`/Admin/teachers/choosesubject/${teacher.teachSclass?._id}/${teacher._id}`)
                                            }>
                                                + Assign Subject
                                            </AssignBtn>
                                        )}
                                    </InfoItem>
                                </InfoGrid>
                                <ActionRow>
                                    <ViewBtn onClick={() => navigate("/Admin/teachers/teacher/" + teacher._id)}>
                                        <VisibilityIcon sx={{ fontSize: 14, mr: 0.5 }} /> View Details
                                    </ViewBtn>
                                </ActionRow>
                            </CardBody>
                        </TeacherCard>
                    );
                }) : (
                    <NoResults>No teachers match your search 🔍</NoResults>
                )}
            </TeachersGrid>
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
    background: linear-gradient(135deg, #764ba2, #f5576c);
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
    background: linear-gradient(135deg, #764ba2, #f5576c);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(118,75,162,0.4);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(118,75,162,0.5);
    }
`;

const TeachersGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 20px;
`;

const TeacherCard = styled.div`
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
    justify-content: center;
    position: relative;
`;

const TeacherAvatar = styled.div`
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: ${props => props.color};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 800;
    box-shadow: 0 4px 14px ${props => props.color}66;
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

const CardBody = styled.div`
    padding: 16px 20px 20px;
`;

const TeacherName = styled.h3`
    font-size: 1rem;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0 0 14px 0;
    text-align: center;
`;

const InfoGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 16px;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const InfoIcon = styled.div`
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

const InfoText = styled.span`
    font-size: 0.85rem;
    font-weight: 600;
    color: #444;
`;

const AssignBtn = styled.button`
    background: #f5576c15;
    color: #f5576c;
    border: none;
    border-radius: 6px;
    padding: 3px 10px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover { background: #f5576c; color: white; }
`;

const ActionRow = styled.div``;

const ViewBtn = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #764ba2, #f5576c);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 10px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover { opacity: 0.9; transform: translateY(-1px); }
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

export default ShowTeachers;