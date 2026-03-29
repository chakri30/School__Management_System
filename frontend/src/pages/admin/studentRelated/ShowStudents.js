import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { Box, IconButton, Chip, Avatar, Typography, InputBase } from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import SearchIcon from '@mui/icons-material/Search';
import * as React from 'react';
import Popup from '../../../components/Popup';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const COLORS = ['#667eea', '#f5576c', '#43e97b', '#4facfe', '#f093fb', '#fa8231', '#a29bfe'];

const ShowStudents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { studentsList, loading, response } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user);
    const [search, setSearch] = useState('');
    const [showPopup, setShowPopup] = React.useState(false);
    const [message, setMessage] = React.useState("");

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    const deleteHandler = (deleteID, address) => {
        setMessage("Sorry the delete function has been disabled for now.");
        setShowPopup(true);
    };

    const filtered = studentsList && studentsList.length > 0
        ? studentsList.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            String(s.rollNum).includes(search)
        )
        : [];

    if (loading) return <LoadingText>Loading students...</LoadingText>;

    if (response) return (
        <EmptyState>
            <EmptyIcon>👨‍🎓</EmptyIcon>
            <EmptyTitle>No Students Yet</EmptyTitle>
            <EmptySubtitle>Start by adding your first student</EmptySubtitle>
            <AddButton onClick={() => navigate("/Admin/addstudents")}>
                <PersonAddAlt1Icon sx={{ mr: 1 }} /> Add Student
            </AddButton>
        </EmptyState>
    );

    return (
        <PageWrapper>
            {/* Header */}
            <PageHeader>
                <HeaderLeft>
                    <PageTitle>👨‍🎓 Students</PageTitle>
                    <TotalBadge>{studentsList?.length || 0} Total</TotalBadge>
                </HeaderLeft>
                <HeaderRight>
                    <SearchBox>
                        <SearchIcon sx={{ color: '#aaa', mr: 1, fontSize: 20 }} />
                        <InputBase
                            placeholder="Search students..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            sx={{ fontSize: '0.9rem', flex: 1 }}
                        />
                    </SearchBox>
                    <AddButton onClick={() => navigate("/Admin/addstudents")}>
                        <PersonAddAlt1Icon sx={{ mr: 1, fontSize: 18 }} /> Add Student
                    </AddButton>
                </HeaderRight>
            </PageHeader>

            {/* Students Grid */}
            <StudentsGrid>
                {filtered.length > 0 ? filtered.map((student, index) => {
                    const color = COLORS[index % COLORS.length];
                    const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    return (
                        <StudentCard key={student._id} delay={index * 0.05} color={color}>
                            <CardTop color={color}>
                                <StudentAvatar color={color}>{initials}</StudentAvatar>
                                <DeleteBtn onClick={() => deleteHandler(student._id, "Student")}>
                                    <PersonRemoveIcon sx={{ fontSize: 16 }} />
                                </DeleteBtn>
                            </CardTop>
                            <CardBody>
                                <StudentName>{student.name}</StudentName>
                                <StudentMeta>
                                    <MetaItem>
                                        <MetaLabel>Roll No.</MetaLabel>
                                        <MetaBadge color={color}>#{student.rollNum}</MetaBadge>
                                    </MetaItem>
                                    <MetaItem>
                                        <MetaLabel>Class</MetaLabel>
                                        <MetaValue>{student.sclassName?.sclassName}</MetaValue>
                                    </MetaItem>
                                </StudentMeta>
                                <ActionRow>
                                    <ActionBtn
                                        color="#667eea"
                                        onClick={() => navigate("/Admin/students/student/" + student._id)}
                                    >
                                        <VisibilityIcon sx={{ fontSize: 14, mr: 0.5 }} /> View
                                    </ActionBtn>
                                    <ActionBtn
                                        color="#43e97b"
                                        onClick={() => navigate("/Admin/students/student/attendance/" + student._id)}
                                    >
                                        <AssignmentIcon sx={{ fontSize: 14, mr: 0.5 }} /> Attend
                                    </ActionBtn>
                                    <ActionBtn
                                        color="#f5576c"
                                        onClick={() => navigate("/Admin/students/student/marks/" + student._id)}
                                    >
                                        <GradeIcon sx={{ fontSize: 14, mr: 0.5 }} /> Marks
                                    </ActionBtn>
                                </ActionRow>
                            </CardBody>
                        </StudentCard>
                    );
                }) : (
                    <NoResults>No students match your search 🔍</NoResults>
                )}
            </StudentsGrid>
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
    background: linear-gradient(135deg, #667eea, #764ba2);
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
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102,126,234,0.4);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102,126,234,0.5);
    }
`;

const StudentsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
`;

const StudentCard = styled.div`
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
    background: ${props => props.color || '#667eea'}22;
    padding: 24px 20px 16px;
    display: flex;
    justify-content: center;
    position: relative;
`;

const StudentAvatar = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: ${props => props.color || '#667eea'};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: 800;
    box-shadow: 0 4px 14px ${props => props.color || '#667eea'}66;
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

const StudentName = styled.h3`
    font-size: 1rem;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0 0 12px 0;
    text-align: center;
`;

const StudentMeta = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    background: #f8f9fa;
    border-radius: 10px;
    padding: 10px 12px;
`;

const MetaItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
`;

const MetaLabel = styled.span`
    font-size: 0.7rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const MetaBadge = styled.span`
    background: ${props => props.color}22;
    color: ${props => props.color};
    font-size: 0.8rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 6px;
`;

const MetaValue = styled.span`
    font-size: 0.82rem;
    font-weight: 600;
    color: #444;
`;

const ActionRow = styled.div`
    display: flex;
    gap: 8px;
`;

const ActionBtn = styled.button`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.color}15;
    color: ${props => props.color};
    border: none;
    border-radius: 10px;
    padding: 8px 4px;
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

export default ShowStudents;