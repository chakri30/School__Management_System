import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import {
    Box, Grid, Typography, CircularProgress, Tab
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ViewStudent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { userDetails, loading } = useSelector((state) => state.user);
    const [value, setValue] = useState('1');

    useEffect(() => {
        dispatch(getUserDetails(params.id, "Student"));
    }, [dispatch, params.id]);

    const handleChange = (event, newValue) => setValue(newValue);

    if (loading) return <LoadingWrapper><CircularProgress sx={{ color: '#667eea' }} /><LoadingText>Loading student...</LoadingText></LoadingWrapper>;

    const student = userDetails;
    const initials = student?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S';

    // Attendance stats
    const attendanceData = student?.attendance || [];
    const totalSessions = attendanceData.length;
    const presentCount = attendanceData.filter(a => a.status === 'Present').length;
    const absentCount = totalSessions - presentCount;
    const attendancePercent = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

    return (
        <PageWrapper>
            {/* Back Button */}
            <BackBtn onClick={() => navigate(-1)}>
                <ArrowBackIcon sx={{ fontSize: 18, mr: 0.5 }} /> Back
            </BackBtn>

            {/* Profile Header */}
            <ProfileHeader>
                <ProfileAvatar>{initials}</ProfileAvatar>
                <ProfileInfo>
                    <StudentName>{student?.name}</StudentName>
                    <StudentMeta>
                        <MetaChip color="#667eea">Roll #{student?.rollNum}</MetaChip>
                        <MetaChip color="#43e97b">{student?.sclassName?.sclassName}</MetaChip>
                        <MetaChip color="#4facfe">{student?.school?.schoolName}</MetaChip>
                    </StudentMeta>
                </ProfileInfo>
            </ProfileHeader>

            {/* Stats Row */}
            <StatsRow>
                <StatBox color="#667eea">
                    <StatValue>{totalSessions}</StatValue>
                    <StatLabel>Total Sessions</StatLabel>
                </StatBox>
                <StatBox color="#43e97b">
                    <StatValue>{presentCount}</StatValue>
                    <StatLabel>Present</StatLabel>
                </StatBox>
                <StatBox color="#f5576c">
                    <StatValue>{absentCount}</StatValue>
                    <StatLabel>Absent</StatLabel>
                </StatBox>
                <StatBox color="#4facfe">
                    <StatValue>{attendancePercent}%</StatValue>
                    <StatLabel>Attendance</StatLabel>
                </StatBox>
            </StatsRow>

            {/* Tabs */}
            <TabsCard>
                <TabContext value={value}>
                    <TabList
                        onChange={handleChange}
                        sx={{
                            borderBottom: '2px solid #f0f2f5',
                            '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' },
                            '& .Mui-selected': { color: '#667eea' },
                            '& .MuiTabs-indicator': { backgroundColor: '#667eea', height: 3, borderRadius: 2 },
                        }}
                    >
                        <Tab label="📋 Attendance" value="1" />
                        <Tab label="📊 Exam Results" value="2" />
                    </TabList>

                    {/* Attendance Tab */}
                    <TabPanel value="1" sx={{ px: 0 }}>
                        {attendanceData.length > 0 ? (
                            <AttendanceList>
                                {attendanceData.map((record, index) => (
                                    <AttendanceItem key={index} present={record.status === 'Present'}>
                                        <AttendanceIcon present={record.status === 'Present'}>
                                            {record.status === 'Present'
                                                ? <CheckCircleIcon sx={{ fontSize: 20 }} />
                                                : <CancelIcon sx={{ fontSize: 20 }} />
                                            }
                                        </AttendanceIcon>
                                        <AttendanceDetails>
                                            <AttendanceSubject>{record.subName?.subName || 'N/A'}</AttendanceSubject>
                                            <AttendanceDate>
                                                {record.date ? new Date(record.date).toLocaleDateString('en-US', {
                                                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                                }) : 'N/A'}
                                            </AttendanceDate>
                                        </AttendanceDetails>
                                        <StatusBadge present={record.status === 'Present'}>
                                            {record.status}
                                        </StatusBadge>
                                    </AttendanceItem>
                                ))}
                            </AttendanceList>
                        ) : (
                            <EmptyState>
                                <EmptyIcon>📋</EmptyIcon>
                                <EmptyText>No attendance records yet</EmptyText>
                            </EmptyState>
                        )}
                    </TabPanel>

                    {/* Exam Results Tab */}
                    <TabPanel value="2" sx={{ px: 0 }}>
                        {student?.examResult && student.examResult.length > 0 ? (
                            <ResultsList>
                                {student.examResult.map((result, index) => {
                                    const marks = result.marksObtained;
                                    const color = marks >= 75 ? '#43e97b' : marks >= 50 ? '#4facfe' : '#f5576c';
                                    return (
                                        <ResultItem key={index}>
                                            <ResultSubject>
                                                <GradeIcon sx={{ fontSize: 18, color: '#667eea', mr: 1 }} />
                                                {result.subName?.subName || 'N/A'}
                                            </ResultSubject>
                                            <MarksBar>
                                                <MarksProgress width={Math.min(marks, 100)} color={color} />
                                            </MarksBar>
                                            <MarksBadge color={color}>{marks} marks</MarksBadge>
                                        </ResultItem>
                                    );
                                })}
                            </ResultsList>
                        ) : (
                            <EmptyState>
                                <EmptyIcon>📊</EmptyIcon>
                                <EmptyText>No exam results yet</EmptyText>
                            </EmptyState>
                        )}
                    </TabPanel>
                </TabContext>
            </TabsCard>
        </PageWrapper>
    );
};

export default ViewStudent;

// ── Styled Components ──────────────────────────────────────────

const PageWrapper = styled.div`
    padding: 24px;
    background: #f0f2f5;
    min-height: 100vh;
    max-width: 900px;
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
    color: #667eea;
    border: 2px solid #667eea22;
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 20px;
    transition: all 0.2s;

    &:hover { background: #667eea; color: white; }
`;

const ProfileHeader = styled.div`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 32px;
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 20px;
    box-shadow: 0 8px 30px rgba(102,126,234,0.4);
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

const StudentName = styled.h2`
    color: white;
    font-size: 1.6rem;
    font-weight: 800;
    margin: 0 0 12px 0;
`;

const StudentMeta = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

const MetaChip = styled.span`
    background: rgba(255,255,255,0.2);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    border: 1px solid rgba(255,255,255,0.3);
`;

const StatsRow = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 20px;
    animation: ${fadeUp} 0.5s ease 0.1s both;

    @media (max-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const StatBox = styled.div`
    background: white;
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    border-top: 4px solid ${props => props.color};
`;

const StatValue = styled.div`
    font-size: 1.8rem;
    font-weight: 800;
    color: #1a1a2e;
`;

const StatLabel = styled.div`
    font-size: 0.75rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
`;

const TabsCard = styled.div`
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    animation: ${fadeUp} 0.5s ease 0.2s both;
`;

const AttendanceList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 8px;
`;

const AttendanceItem = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: ${props => props.present ? '#f0fff4' : '#fff5f5'};
    border-radius: 12px;
    border: 1px solid ${props => props.present ? '#c6f6d5' : '#fed7d7'};
`;

const AttendanceIcon = styled.div`
    color: ${props => props.present ? '#43e97b' : '#f5576c'};
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

const AttendanceDetails = styled.div`flex: 1;`;

const AttendanceSubject = styled.div`
    font-size: 0.9rem;
    font-weight: 700;
    color: #333;
`;

const AttendanceDate = styled.div`
    font-size: 0.75rem;
    color: #888;
    margin-top: 2px;
`;

const StatusBadge = styled.span`
    background: ${props => props.present ? '#43e97b' : '#f5576c'};
    color: white;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
`;

const ResultsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 8px;
`;

const ResultItem = styled.div`
    background: #f8f9fa;
    border-radius: 14px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
`;

const ResultSubject = styled.div`
    font-size: 0.9rem;
    font-weight: 700;
    color: #333;
    display: flex;
    align-items: center;
    min-width: 140px;
`;

const MarksBar = styled.div`
    flex: 1;
    height: 8px;
    background: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
`;

const MarksProgress = styled.div`
    width: ${props => props.width}%;
    height: 100%;
    background: ${props => props.color};
    border-radius: 4px;
    transition: width 1s ease;
`;

const MarksBadge = styled.span`
    background: ${props => props.color}22;
    color: ${props => props.color};
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.82rem;
    font-weight: 700;
    min-width: 80px;
    text-align: center;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 50px 20px;
`;

const EmptyIcon = styled.div`font-size: 3rem; margin-bottom: 12px;`;
const EmptyText = styled.p`color: #aaa; font-size: 1rem; margin: 0;`;