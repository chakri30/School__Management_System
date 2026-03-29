import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ClassIcon from '@mui/icons-material/Class';
import BookIcon from '@mui/icons-material/Book';
import TimerIcon from '@mui/icons-material/Timer';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    if (loading) return (
        <LoadingWrapper>
            <CircularProgress sx={{ color: '#764ba2' }} />
            <LoadingText>Loading teacher details...</LoadingText>
        </LoadingWrapper>
    );

    const teacher = teacherDetails;
    const initials = teacher?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'T';
    const hasSubject = teacher?.teachSubject?.subName;

    const infoCards = [
        {
            icon: <ClassIcon sx={{ fontSize: 20 }} />,
            label: 'Assigned Class',
            value: teacher?.teachSclass?.sclassName || 'N/A',
            color: '#4facfe',
        },
        {
            icon: <BookIcon sx={{ fontSize: 20 }} />,
            label: 'Subject',
            value: hasSubject || 'Not Assigned',
            color: hasSubject ? '#43e97b' : '#f5576c',
        },
        {
            icon: <TimerIcon sx={{ fontSize: 20 }} />,
            label: 'Sessions',
            value: teacher?.teachSubject?.sessions
                ? `${teacher.teachSubject.sessions} Sessions`
                : 'N/A',
            color: '#667eea',
        },
    ];

    return (
        <PageWrapper>
            <BackBtn onClick={() => navigate(-1)}>
                <ArrowBackIcon sx={{ fontSize: 18, mr: 0.5 }} /> Back
            </BackBtn>

            {/* Profile Header */}
            <ProfileHeader>
                <ProfileAvatar>{initials}</ProfileAvatar>
                <ProfileInfo>
                    <TeacherName>{teacher?.name}</TeacherName>
                    <RoleBadge>
                        <SupervisorAccountIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        Teacher
                    </RoleBadge>
                </ProfileInfo>
            </ProfileHeader>

            {/* Info Cards */}
            <InfoGrid>
                {infoCards.map((card, index) => (
                    <InfoCard key={index} color={card.color} delay={index * 0.1}>
                        <InfoIconBox color={card.color}>
                            {card.icon}
                        </InfoIconBox>
                        <InfoContent>
                            <InfoLabel>{card.label}</InfoLabel>
                            <InfoValue>{card.value}</InfoValue>
                        </InfoContent>
                    </InfoCard>
                ))}
            </InfoGrid>

            {/* Assign Subject button if no subject */}
            {!hasSubject && (
                <AssignCard>
                    <AssignText>
                        ⚠️ This teacher doesn't have a subject assigned yet.
                    </AssignText>
                    <AssignBtn
                        onClick={() =>
                            navigate(`/Admin/teachers/choosesubject/${teacher?.teachSclass?._id}/${teacher?._id}`)
                        }
                    >
                        <AddIcon sx={{ fontSize: 18, mr: 0.5 }} /> Assign Subject
                    </AssignBtn>
                </AssignCard>
            )}

            {/* Attendance Section */}
            {teacher?.attendance && teacher.attendance.length > 0 && (
                <SectionCard>
                    <SectionTitle>📅 Attendance Records</SectionTitle>
                    <AttendanceList>
                        {teacher.attendance.map((record, index) => (
                            <AttendanceItem key={index} present={record.status === 'Present'}>
                                <AttendanceDot present={record.status === 'Present'} />
                                <AttendanceDate>
                                    {record.date
                                        ? new Date(record.date).toLocaleDateString('en-US', {
                                            weekday: 'short', year: 'numeric',
                                            month: 'short', day: 'numeric'
                                        })
                                        : 'N/A'}
                                </AttendanceDate>
                                <StatusBadge present={record.status === 'Present'}>
                                    {record.status}
                                </StatusBadge>
                            </AttendanceItem>
                        ))}
                    </AttendanceList>
                </SectionCard>
            )}
        </PageWrapper>
    );
};

export default TeacherDetails;

// ── Styled Components ──────────────────────────────────────────

const PageWrapper = styled.div`
    padding: 24px;
    background: #f0f2f5;
    min-height: 100vh;
    max-width: 800px;
    margin: 0 auto;
`;

const LoadingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    gap: 16px;
`;

const LoadingText = styled.p`color: #888; font-size: 1rem;`;

const BackBtn = styled.button`
    display: flex;
    align-items: center;
    background: white;
    color: #764ba2;
    border: 2px solid #764ba222;
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 20px;
    transition: all 0.2s;

    &:hover { background: #764ba2; color: white; }
`;

const ProfileHeader = styled.div`
    background: linear-gradient(135deg, #764ba2 0%, #f5576c 100%);
    border-radius: 20px;
    padding: 32px;
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 20px;
    box-shadow: 0 8px 30px rgba(118,75,162,0.4);
    animation: ${fadeUp} 0.5s ease forwards;
`;

const ProfileAvatar = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(255,255,255,0.25);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    font-weight: 800;
    border: 3px solid rgba(255,255,255,0.4);
    flex-shrink: 0;
`;

const ProfileInfo = styled.div`flex: 1;`;

const TeacherName = styled.h2`
    color: white;
    font-size: 1.6rem;
    font-weight: 800;
    margin: 0 0 10px 0;
`;

const RoleBadge = styled.span`
    display: inline-flex;
    align-items: center;
    background: rgba(255,255,255,0.2);
    color: white;
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 0.82rem;
    font-weight: 600;
    border: 1px solid rgba(255,255,255,0.3);
`;

const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
    animation: ${fadeUp} 0.5s ease 0.1s both;
`;

const InfoCard = styled.div`
    background: white;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    border-left: 4px solid ${props => props.color};
    animation: ${fadeUp} 0.5s ease ${props => props.delay || 0}s both;
    transition: transform 0.2s;

    &:hover { transform: translateY(-3px); }
`;

const InfoIconBox = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: ${props => props.color}22;
    color: ${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const InfoContent = styled.div``;

const InfoLabel = styled.div`
    font-size: 0.72rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
`;

const InfoValue = styled.div`
    font-size: 0.95rem;
    font-weight: 700;
    color: #1a1a2e;
`;

const AssignCard = styled.div`
    background: #fff8e1;
    border: 2px dashed #ffc107;
    border-radius: 16px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    animation: ${fadeUp} 0.5s ease 0.2s both;
`;

const AssignText = styled.p`
    margin: 0;
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
`;

const AssignBtn = styled.button`
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #764ba2, #f5576c);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(118,75,162,0.3);

    &:hover { transform: translateY(-2px); opacity: 0.9; }
`;

const SectionCard = styled.div`
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    animation: ${fadeUp} 0.5s ease 0.3s both;
`;

const SectionTitle = styled.h3`
    font-size: 1rem;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0 0 16px 0;
`;

const AttendanceList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const AttendanceItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: ${props => props.present ? '#f0fff4' : '#fff5f5'};
    border-radius: 10px;
    border: 1px solid ${props => props.present ? '#c6f6d5' : '#fed7d7'};
`;

const AttendanceDot = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => props.present ? '#43e97b' : '#f5576c'};
    flex-shrink: 0;
`;

const AttendanceDate = styled.div`
    flex: 1;
    font-size: 0.85rem;
    font-weight: 600;
    color: #444;
`;

const StatusBadge = styled.span`
    background: ${props => props.present ? '#43e97b' : '#f5576c'};
    color: white;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
`;