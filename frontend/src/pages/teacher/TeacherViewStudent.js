import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
    Box, Table, TableBody, TableHead, Typography,
    Collapse, Button, Chip, CircularProgress, Avatar
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import BadgeIcon from '@mui/icons-material/Badge';
import {
    calculateOverallAttendancePercentage,
    calculateSubjectAttendancePercentage,
    groupAttendanceBySubject
} from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

/* ─── Animations ──────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Styled Components ───────────────────────────────────── */
const PageWrapper = styled(Box)`
  min-height: 100vh;
  background: #f1f5f9;
  padding: 36px 20px 60px;
  font-family: 'Georgia', serif;
`;

const PageInner = styled(Box)`
  max-width: 860px;
  margin: 0 auto;
`;

const HeroCard = styled(Box)`
  background: linear-gradient(135deg, #064e3b 0%, #065f46 55%, #047857 100%);
  border-radius: 24px;
  padding: 40px 36px;
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(6,78,59,0.4);
  margin-bottom: 24px;
  animation: ${fadeUp} 0.55s ease both;

  &::before {
    content: '';
    position: absolute;
    top: -70px; right: -70px;
    width: 220px; height: 220px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -50px; left: -50px;
    width: 180px; height: 180px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
  }
`;

const StudentAvatar = styled(Avatar)`
  width: 72px !important;
  height: 72px !important;
  font-size: 1.8rem !important;
  font-family: 'Georgia', serif !important;
  background: rgba(255,255,255,0.18) !important;
  border: 2px solid rgba(255,255,255,0.3) !important;
  margin-right: 20px;
`;

const StatChip = styled(Chip)`
  background: rgba(255,255,255,0.15) !important;
  color: #fff !important;
  border: 1px solid rgba(255,255,255,0.25) !important;
  font-family: 'Georgia', serif !important;
  font-weight: 600 !important;
  margin: 4px !important;
  .MuiChip-icon { color: rgba(255,255,255,0.8) !important; }
`;

const SectionCard = styled(Box)`
  background: #fff;
  border-radius: 20px;
  padding: 28px 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  margin-bottom: 20px;
  animation: ${fadeUp} 0.6s ease both;
  animation-delay: ${({ delay }) => delay || '0s'};
  opacity: 0;
  animation-fill-mode: forwards;
`;

const SectionTitle = styled(Typography)`
  font-family: 'Georgia', serif !important;
  font-size: 0.68rem !important;
  font-weight: 700 !important;
  letter-spacing: 2.5px !important;
  text-transform: uppercase !important;
  color: #065f46 !important;
  margin-bottom: 18px !important;
`;

const GlowDivider = styled(Box)`
  height: 1px;
  background: linear-gradient(90deg, transparent, #d1fae5, transparent);
  margin: 18px 0;
`;

const ActionButton = styled(Button)`
  border-radius: 12px !important;
  font-family: 'Georgia', serif !important;
  font-weight: 600 !important;
  text-transform: none !important;
  padding: 9px 22px !important;
`;

const AddAttendanceBtn = styled(ActionButton)`
  background: linear-gradient(135deg, #064e3b, #059669) !important;
  color: #fff !important;
  box-shadow: 0 4px 16px rgba(6,78,59,0.3) !important;
  &:hover { box-shadow: 0 6px 22px rgba(6,78,59,0.45) !important; }
`;

const AddMarksBtn = styled(ActionButton)`
  background: linear-gradient(135deg, #1e3a8a, #3b82f6) !important;
  color: #fff !important;
  box-shadow: 0 4px 16px rgba(30,58,138,0.3) !important;
  &:hover { box-shadow: 0 6px 22px rgba(30,58,138,0.45) !important; }
`;

const DetailsBtn = styled(Button)`
  border-radius: 8px !important;
  font-family: 'Georgia', serif !important;
  font-size: 0.78rem !important;
  text-transform: none !important;
  background: #ecfdf5 !important;
  color: #065f46 !important;
  border: 1px solid #a7f3d0 !important;
  padding: 4px 12px !important;
  &:hover { background: #d1fae5 !important; }
`;

const PercentBadge = styled(Box)`
  display: inline-flex;
  align-items: center;
  background: ${({ pct }) =>
        pct >= 75 ? '#ecfdf5' : pct >= 50 ? '#fffbeb' : '#fef2f2'};
  color: ${({ pct }) =>
        pct >= 75 ? '#065f46' : pct >= 50 ? '#92400e' : '#991b1b'};
  border: 1px solid ${({ pct }) =>
        pct >= 75 ? '#a7f3d0' : pct >= 50 ? '#fde68a' : '#fecaca'};
  border-radius: 8px;
  padding: 2px 10px;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: 'Georgia', serif;
`;

const EmptyState = styled(Box)`
  text-align: center;
  padding: 32px 0;
  color: #94a3b8;
  font-family: 'Georgia', serif;
  font-style: italic;
`;

const LoadingWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 16px;
  color: #064e3b;
`;

/* ─── Component ───────────────────────────────────────────── */
const TeacherViewStudent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { currentUser, userDetails, response, loading, error } = useSelector((s) => s.user);

    const address = 'Student';
    const studentID = params.id;
    const teachSubject = currentUser.teachSubject?.subName;
    const teachSubjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID]);

    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState([]);
    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) =>
        setOpenStates((p) => ({ ...p, [subId]: !p[subId] }));

    useEffect(() => {
        if (userDetails) {
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || []);
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const overallPct = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPct = 100 - overallPct;
    const chartData = [
        { name: 'Present', value: overallPct },
        { name: 'Absent', value: overallAbsentPct },
    ];

    const groupedAttendance = groupAttendanceBySubject(subjectAttendance);
    const mySubjectData = Object.entries(groupedAttendance).find(([name]) => name === teachSubject);
    const myMarks = Array.isArray(subjectMarks)
        ? subjectMarks.find((r) => r?.subName?.subName === teachSubject)
        : null;

    if (loading) {
        return (
            <PageWrapper>
                <LoadingWrapper>
                    <CircularProgress sx={{ color: '#059669' }} size={48} />
                    <Typography sx={{ fontFamily: 'Georgia, serif', color: '#64748b' }}>
                        Loading student details…
                    </Typography>
                </LoadingWrapper>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <PageInner>

                {/* ── Hero card ── */}
                <HeroCard>
                    <Box display="flex" alignItems="center" position="relative" zIndex={1}>
                        <StudentAvatar>
                            {String(userDetails?.name ?? 'S').charAt(0)}
                        </StudentAvatar>
                        <Box>
                            <Typography sx={{
                                fontFamily: 'Georgia, serif', fontWeight: 700,
                                fontSize: '1.7rem', color: '#fff', mb: 0.5
                            }}>
                                {userDetails?.name}
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                                <StatChip icon={<BadgeIcon />} label={`Roll No: ${userDetails?.rollNum}`} size="small" />
                                <StatChip icon={<ClassIcon />} label={sclassName?.sclassName} size="small" />
                                <StatChip icon={<SchoolIcon />} label={studentSchool?.schoolName} size="small" />
                            </Box>
                        </Box>
                    </Box>
                </HeroCard>

                {/* ── Attendance section ── */}
                <SectionCard delay="0.1s">
                    <SectionTitle>Attendance — {teachSubject}</SectionTitle>
                    <GlowDivider />

                    {mySubjectData ? (() => {
                        const [subName, { present, allData, subId, sessions }] = mySubjectData;
                        const subPct = calculateSubjectAttendancePercentage(present, sessions);
                        return (
                            <>
                                <Table>
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell>Subject</StyledTableCell>
                                            <StyledTableCell>Present</StyledTableCell>
                                            <StyledTableCell>Sessions</StyledTableCell>
                                            <StyledTableCell>Attendance</StyledTableCell>
                                            <StyledTableCell align="center">Details</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        <StyledTableRow>
                                            <StyledTableCell sx={{ fontWeight: 600 }}>{subName}</StyledTableCell>
                                            <StyledTableCell>{present}</StyledTableCell>
                                            <StyledTableCell>{sessions}</StyledTableCell>
                                            <StyledTableCell>
                                                <PercentBadge pct={subPct}>{subPct}%</PercentBadge>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <DetailsBtn onClick={() => handleOpen(subId)} size="small">
                                                    {openStates[subId] ? <KeyboardArrowUp sx={{ fontSize: 16 }} /> : <KeyboardArrowDown sx={{ fontSize: 16 }} />}
                                                    &nbsp;{openStates[subId] ? 'Hide' : 'Show'}
                                                </DetailsBtn>
                                            </StyledTableCell>
                                        </StyledTableRow>

                                        {/* Expanded rows */}
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                                                <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                    <Box sx={{ m: 2, background: '#f8fafc', borderRadius: '12px', p: 2 }}>
                                                        <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#64748b', mb: 1.5 }}>
                                                            Attendance Log
                                                        </Typography>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <StyledTableRow>
                                                                    <StyledTableCell>Date</StyledTableCell>
                                                                    <StyledTableCell align="right">Status</StyledTableCell>
                                                                </StyledTableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {allData.map((data, i) => {
                                                                    const date = new Date(data.date);
                                                                    const ds = date.toString() !== 'Invalid Date'
                                                                        ? date.toISOString().substring(0, 10) : 'Invalid Date';
                                                                    return (
                                                                        <StyledTableRow key={i}>
                                                                            <StyledTableCell>{ds}</StyledTableCell>
                                                                            <StyledTableCell align="right">
                                                                                <Chip
                                                                                    label={data.status}
                                                                                    size="small"
                                                                                    sx={{
                                                                                        background: data.status === 'Present' ? '#ecfdf5' : '#fef2f2',
                                                                                        color: data.status === 'Present' ? '#065f46' : '#991b1b',
                                                                                        border: `1px solid ${data.status === 'Present' ? '#a7f3d0' : '#fecaca'}`,
                                                                                        fontFamily: 'Georgia, serif',
                                                                                        fontWeight: 700,
                                                                                        fontSize: '0.75rem',
                                                                                    }}
                                                                                />
                                                                            </StyledTableCell>
                                                                        </StyledTableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </Box>
                                                </Collapse>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>

                                <GlowDivider />

                                <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mt={1}>
                                    <Box>
                                        <Typography sx={{ fontFamily: 'Georgia, serif', fontSize: '0.8rem', color: '#64748b' }}>
                                            Overall Attendance
                                        </Typography>
                                        <PercentBadge pct={overallPct} sx={{ mt: 0.5 }}>
                                            {overallPct.toFixed(1)}%
                                        </PercentBadge>
                                    </Box>
                                    <CustomPieChart data={chartData} />
                                </Box>
                            </>
                        );
                    })() : (
                        <EmptyState>No attendance recorded for {teachSubject} yet.</EmptyState>
                    )}

                    <Box mt={3}>
                        <AddAttendanceBtn
                            startIcon={<AddIcon />}
                            onClick={() => navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)}
                        >
                            Add Attendance
                        </AddAttendanceBtn>
                    </Box>
                </SectionCard>

                {/* ── Marks section ── */}
                <SectionCard delay="0.2s">
                    <SectionTitle>Subject Marks — {teachSubject}</SectionTitle>
                    <GlowDivider />

                    {myMarks ? (
                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell>Subject</StyledTableCell>
                                    <StyledTableCell>Marks Obtained</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                <StyledTableRow>
                                    <StyledTableCell sx={{ fontWeight: 600 }}>{myMarks.subName.subName}</StyledTableCell>
                                    <StyledTableCell>
                                        <PercentBadge pct={myMarks.marksObtained}>{myMarks.marksObtained}</PercentBadge>
                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    ) : (
                        <EmptyState>No marks recorded for {teachSubject} yet.</EmptyState>
                    )}

                    <Box mt={3}>
                        <AddMarksBtn
                            startIcon={<AddIcon />}
                            onClick={() => navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)}
                        >
                            Add Marks
                        </AddMarksBtn>
                    </Box>
                </SectionCard>

            </PageInner>
        </PageWrapper>
    );
};

export default TeacherViewStudent;