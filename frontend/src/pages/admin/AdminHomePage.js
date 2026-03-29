import { Container, Grid, Paper, Box, Typography, Button, Avatar, Chip } from '@mui/material'
import SeeNotice from '../../components/SeeNotice';
import styled, { keyframes } from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import { useNavigate } from 'react-router-dom';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SchoolIcon from '@mui/icons-material/School';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ClassIcon from '@mui/icons-material/Class';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector(state => state.user);

    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    const statsCards = [
        {
            title: 'Total Students',
            value: numberOfStudents,
            icon: <PeopleAltIcon sx={{ fontSize: 36 }} />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            shadow: 'rgba(102, 126, 234, 0.5)',
            prefix: '',
            duration: 2.5,
        },
        {
            title: 'Total Classes',
            value: numberOfClasses,
            icon: <SchoolIcon sx={{ fontSize: 36 }} />,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            shadow: 'rgba(245, 87, 108, 0.5)',
            prefix: '',
            duration: 2,
        },
        {
            title: 'Total Teachers',
            value: numberOfTeachers,
            icon: <SupervisorAccountIcon sx={{ fontSize: 36 }} />,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            shadow: 'rgba(79, 172, 254, 0.5)',
            prefix: '',
            duration: 2.5,
        },
        {
            title: 'Fees Collected',
            value: 23000,
            icon: <AccountBalanceIcon sx={{ fontSize: 36 }} />,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            shadow: 'rgba(67, 233, 123, 0.5)',
            prefix: '$',
            duration: 3,
        },
    ];

    const quickActions = [
        { label: 'Add Student', icon: <PersonAddIcon />, path: '/Admin/addstudents', color: '#667eea' },
        { label: 'Add Teacher', icon: <SupervisorAccountIcon />, path: '/Admin/teachers/chooseclass', color: '#f5576c' },
        { label: 'Add Class', icon: <ClassIcon />, path: '/Admin/addclass', color: '#4facfe' },
        { label: 'Add Notice', icon: <AnnouncementIcon />, path: '/Admin/addnotice', color: '#43e97b' },
    ];

    const recentActivities = [
        { text: 'New student registered', time: 'Just now', icon: <PersonAddIcon />, color: '#667eea' },
        { text: 'Attendance marked for Class A', time: '2 hours ago', icon: <CheckCircleIcon />, color: '#43e97b' },
        { text: 'Exam results updated', time: '5 hours ago', icon: <EmojiEventsIcon />, color: '#f5576c' },
        { text: 'New notice published', time: '1 day ago', icon: <AnnouncementIcon />, color: '#4facfe' },
        { text: 'Teacher added to Math class', time: '2 days ago', icon: <SupervisorAccountIcon />, color: '#f093fb' },
    ];

    return (
        <PageWrapper>
            {/* Header Banner */}
            <WelcomeBanner>
                <BannerContent>
                    <WelcomeText>
                        Welcome back, <span>{currentUser.name}! 👋</span>
                    </WelcomeText>
                    <SubText>Here's what's happening at {currentUser.schoolName} today</SubText>
                </BannerContent>
                <TrendingUpIcon sx={{ fontSize: 80, opacity: 0.15, color: 'white' }} />
            </WelcomeBanner>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
                {/* Stats Cards */}
                <SectionTitle>📊 Overview</SectionTitle>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {statsCards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <StatCard gradient={card.gradient} shadow={card.shadow} delay={index * 0.1}>
                                <CardIconWrapper gradient={card.gradient}>
                                    {card.icon}
                                </CardIconWrapper>
                                <CardBody>
                                    <StatNumber>
                                        <CountUp
                                            start={0}
                                            end={card.value || 0}
                                            duration={card.duration}
                                            prefix={card.prefix}
                                            separator=","
                                        />
                                    </StatNumber>
                                    <StatLabel>{card.title}</StatLabel>
                                </CardBody>
                                <GlowEffect gradient={card.gradient} />
                            </StatCard>
                        </Grid>
                    ))}
                </Grid>

                {/* Quick Actions */}
                <SectionTitle>⚡ Quick Actions</SectionTitle>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {quickActions.map((action, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                            <QuickActionCard
                                onClick={() => navigate(action.path)}
                                color={action.color}
                                delay={index * 0.1}
                            >
                                <ActionIcon color={action.color}>{action.icon}</ActionIcon>
                                <ActionLabel>{action.label}</ActionLabel>
                                <AddIcon sx={{
                                    position: 'absolute', right: 10, top: 10,
                                    fontSize: 16, opacity: 0.5, color: action.color
                                }} />
                            </QuickActionCard>
                        </Grid>
                    ))}
                </Grid>

                {/* Bottom Section: Activity + Notices */}
                <Grid container spacing={3}>
                    {/* Recent Activity */}
                    <Grid item xs={12} md={5}>
                        <ActivityCard>
                            <ActivityHeader>
                                <TrendingUpIcon sx={{ color: '#667eea', mr: 1 }} />
                                <Typography variant="h6" fontWeight={700}>Recent Activity</Typography>
                            </ActivityHeader>
                            {recentActivities.map((activity, index) => (
                                <ActivityItem key={index} delay={index * 0.1}>
                                    <ActivityDot color={activity.color}>
                                        {activity.icon}
                                    </ActivityDot>
                                    <ActivityDetails>
                                        <ActivityText>{activity.text}</ActivityText>
                                        <ActivityTime>{activity.time}</ActivityTime>
                                    </ActivityDetails>
                                </ActivityItem>
                            ))}
                        </ActivityCard>
                    </Grid>

                    {/* Notices */}
                    <Grid item xs={12} md={7}>
                        <NoticeCard>
                            <ActivityHeader>
                                <AnnouncementIcon sx={{ color: '#f5576c', mr: 1 }} />
                                <Typography variant="h6" fontWeight={700}>Latest Notices</Typography>
                                <Chip
                                    label="View All"
                                    size="small"
                                    onClick={() => navigate('/Admin/notices')}
                                    sx={{
                                        ml: 'auto', cursor: 'pointer',
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        color: 'white', fontWeight: 600
                                    }}
                                />
                            </ActivityHeader>
                            <SeeNotice />
                        </NoticeCard>
                    </Grid>
                </Grid>
            </Container>
        </PageWrapper>
    );
};

// ── Styled Components ──────────────────────────────────────────

const PageWrapper = styled.div`
    background: #f0f2f5;
    min-height: 100vh;
`;

const WelcomeBanner = styled.div`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f5576c 100%);
    padding: 32px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    animation: ${fadeUp} 0.6s ease forwards;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -10%;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: rgba(255,255,255,0.08);
    }
`;

const BannerContent = styled.div``;

const WelcomeText = styled.h1`
    color: white;
    font-size: 1.8rem;
    font-weight: 800;
    margin: 0 0 8px 0;
    span { color: #ffe066; }
`;

const SubText = styled.p`
    color: rgba(255,255,255,0.85);
    margin: 0;
    font-size: 1rem;
`;

const SectionTitle = styled.h2`
    font-size: 1.1rem;
    font-weight: 700;
    color: #444;
    margin: 0 0 16px 0;
    letter-spacing: 0.5px;
`;

const StatCard = styled.div`
    background: white;
    border-radius: 20px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 20px ${props => props.shadow || 'rgba(0,0,0,0.1)'};
    animation: ${fadeUp} 0.6s ease ${props => props.delay || 0}s both;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 30px ${props => props.shadow || 'rgba(0,0,0,0.2)'};
    }
`;

const GlowEffect = styled.div`
    position: absolute;
    top: -30px;
    right: -30px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: ${props => props.gradient};
    opacity: 0.15;
`;

const CardIconWrapper = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 16px;
    background: ${props => props.gradient};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
`;

const CardBody = styled.div``;

const StatNumber = styled.div`
    font-size: 2rem;
    font-weight: 800;
    color: #1a1a2e;
    line-height: 1;
    margin-bottom: 6px;
`;

const StatLabel = styled.div`
    font-size: 0.85rem;
    color: #888;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const QuickActionCard = styled.div`
    background: white;
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    position: relative;
    border: 2px solid transparent;
    animation: ${fadeUp} 0.6s ease ${props => props.delay || 0}s both;
    transition: all 0.3s ease;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);

    &:hover {
        border-color: ${props => props.color};
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }
`;

const ActionIcon = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: ${props => props.color}22;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.color};
    margin-bottom: 12px;
`;

const ActionLabel = styled.div`
    font-size: 0.9rem;
    font-weight: 700;
    color: #333;
`;

const ActivityCard = styled(Paper)`
    padding: 24px !important;
    border-radius: 20px !important;
    height: 100%;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06) !important;
`;

const NoticeCard = styled(Paper)`
    padding: 24px !important;
    border-radius: 20px !important;
    height: 100%;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06) !important;
`;

const ActivityHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f5f5f5;
`;

const ActivityItem = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid #f9f9f9;
    animation: ${fadeUp} 0.5s ease ${props => props.delay || 0}s both;

    &:last-child { border-bottom: none; }
`;

const ActivityDot = styled.div`
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: ${props => props.color}22;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.color};
    flex-shrink: 0;
    font-size: 18px;
`;

const ActivityDetails = styled.div`
    flex: 1;
`;

const ActivityText = styled.div`
    font-size: 0.88rem;
    font-weight: 600;
    color: #333;
`;

const ActivityTime = styled.div`
    font-size: 0.75rem;
    color: #aaa;
    margin-top: 2px;
`;

export default AdminHomePage;