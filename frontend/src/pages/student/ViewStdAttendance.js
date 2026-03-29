import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import {
    BottomNavigation, BottomNavigationAction, Box,
    Button, Chip, Collapse, Container, LinearProgress,
    Paper, Table, TableBody, TableHead, Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import {
    calculateOverallAttendancePercentage,
    calculateSubjectAttendancePercentage,
    groupAttendanceBySubject,
} from '../../components/attendanceCalculator';
import CustomBarChart from '../../components/CustomBarChart';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import EventNoteIcon from '@mui/icons-material/EventNote';

import { StyledTableCell, StyledTableRow } from '../../components/styles';

/* ─── Animations ─────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;


/* ─── Styled Components ───────────────────────────────────── */
const PageWrapper = styled(Box)`
  min-height: 100vh;
  background: #f0f4f8;
  padding: 40px 0 100px;
  font-family: 'Georgia', serif;
`;

const PageHeader = styled(Box)`
  text-align: center;
  margin-bottom: 32px;
  animation: ${fadeUp} 0.5s ease both;
`;

const HeaderTitle = styled(Typography)`
  font-family: 'Georgia', serif !important;
  font-size: 2rem !important;
  font-weight: 700 !important;
  color: #1a237e !important;
  letter-spacing: -0.5px !important;
`;

const HeaderSub = styled(Typography)`
  font-family: 'Georgia', serif !important;
  font-size: 0.875rem !important;
  color: #7986cb !important;
  margin-top: 4px !important;
`;

/* ── Overall attendance hero card ── */
const OverallCard = styled(Box)`
  border-radius: 20px;
  padding: 28px 32px;
  margin-bottom: 24px;
  background: ${({ pct }) =>
        pct >= 75
            ? 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)'
            : 'linear-gradient(135deg, #b71c1c 0%, #c62828 100%)'};
  color: #fff;
  box-shadow: 0 12px 40px ${({ pct }) =>
        pct >= 75 ? 'rgba(27,94,32,0.35)' : 'rgba(183,28,28,0.35)'};
  display: flex;
  align-items: center;
  gap: 20px;
  animation: ${fadeUp} 0.5s ease both;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    right: -40px; top: -40px;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
  }
`;

const OverallPct = styled(Typography)`
  font-family: 'Georgia', serif !important;
  font-size: 3rem !important;
  font-weight: 700 !important;
  line-height: 1 !important;
  color: #fff !important;
`;

const TableCard = styled(Box)`
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  animation: ${fadeUp} 0.5s ease 0.15s both;
  margin-bottom: 16px;
`;

const TableHeaderCell = styled(StyledTableCell)`
  background: linear-gradient(135deg, #1a237e, #283593) !important;
  color: #fff !important;
  font-family: 'Georgia', serif !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  font-size: 0.8rem !important;
  padding: 14px 16px !important;
  border: none !important;
  white-space: nowrap !important;
`;

const BodyCell = styled(StyledTableCell)`
  font-family: 'Georgia', serif !important;
  padding: 14px 16px !important;
  color: #37474f !important;
  border-bottom: 1px solid #f0f4f8 !important;
  vertical-align: middle !important;
`;

const ProgressBar = styled(LinearProgress)`
  border-radius: 6px !important;
  height: 8px !important;
  background-color: #f0f4f8 !important;
  width: 100px;

  .MuiLinearProgress-bar {
    border-radius: 6px !important;
    background: ${({ value }) =>
        value >= 75
            ? 'linear-gradient(90deg, #43a047, #66bb6a)'
            : 'linear-gradient(90deg, #ef5350, #e53935)'} !important;
  }
`;

const DetailsButton = styled(Button)`
  border-radius: 10px !important;
  text-transform: none !important;
  font-family: 'Georgia', serif !important;
  font-size: 0.78rem !important;
  font-weight: 600 !important;
  padding: 6px 14px !important;
  background: #f0f4f8 !important;
  color: #3949ab !important;
  box-shadow: none !important;
  border: 1px solid #c5cae9 !important;

  &:hover {
    background: #e8eaf6 !important;
    box-shadow: none !important;
  }
`;

const DetailRow = styled(StyledTableRow)`
  &:hover td { background: #f5f7ff !important; }
`;

const StatusChip = styled(Chip)`
  font-size: 0.72rem !important;
  font-weight: 700 !important;
  border-radius: 6px !important;
  height: 24px !important;
`;

const BottomNav = styled(Paper)`
  position: fixed !important;
  bottom: 0; left: 0; right: 0;
  border-top: 1px solid #e8eaf6 !important;
  box-shadow: 0 -4px 24px rgba(26,35,126,0.1) !important;
`;

/* ─── Component ───────────────────────────────────────────── */
const ViewStdAttendance = () => {
    const dispatch = useDispatch();

    const [openStates, setOpenStates] = useState({});
    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    const { userDetails, currentUser, loading } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, 'Student'));
    }, [dispatch, currentUser._id]);

    useEffect(() => {
        if (userDetails) setSubjectAttendance(userDetails.attendance || []);
    }, [userDetails]);

    const handleOpen = (subId) =>
        setOpenStates((prev) => ({ ...prev, [subId]: !prev[subId] }));

    const handleSectionChange = (_, v) => setSelectedSection(v);

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);
    const overallPct = calculateOverallAttendancePercentage(subjectAttendance);

    const subjectData = Object.entries(attendanceBySubject).map(
        ([subName, { subCode, present, sessions }]) => ({
            subject: subName,
            attendancePercentage: calculateSubjectAttendancePercentage(present, sessions),
            totalClasses: sessions,
            attendedClasses: present,
        })
    );

    /* ── Table section ── */
    const renderTableSection = () => (
        <Box>
            {/* Overall card */}
            <OverallCard pct={overallPct}>
                <Box>
                    {overallPct >= 75
                        ? <CheckCircleIcon sx={{ fontSize: 44 }} />
                        : <WarningAmberIcon sx={{ fontSize: 44 }} />}
                </Box>
                <Box flex={1} position="relative" zIndex={1}>
                    <Typography sx={{ fontFamily: 'Georgia', fontSize: '0.8rem', opacity: 0.8, letterSpacing: '1px', textTransform: 'uppercase', mb: 0.5 }}>
                        Overall Attendance
                    </Typography>
                    <OverallPct>{overallPct.toFixed(1)}%</OverallPct>
                    <Typography sx={{ fontFamily: 'Georgia', fontSize: '0.82rem', opacity: 0.75, mt: 0.5 }}>
                        {overallPct >= 75
                            ? 'Great attendance! Keep it up.'
                            : 'Attendance below 75% — please attend more classes.'}
                    </Typography>
                </Box>
            </OverallCard>

            {/* Per-subject table */}
            <TableCard>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <TableHeaderCell>Subject</TableHeaderCell>
                            <TableHeaderCell align="center">Present</TableHeaderCell>
                            <TableHeaderCell align="center">Total</TableHeaderCell>
                            <TableHeaderCell>Progress</TableHeaderCell>
                            <TableHeaderCell align="center">%</TableHeaderCell>
                            <TableHeaderCell align="center">Details</TableHeaderCell>
                        </StyledTableRow>
                    </TableHead>

                    {Object.entries(attendanceBySubject).map(
                        ([subName, { present, allData, subId, sessions }], index) => {
                            const pct = calculateSubjectAttendancePercentage(present, sessions);
                            const isOpen = openStates[subId];

                            return (
                                <TableBody key={index}>
                                    <StyledTableRow sx={{ '&:hover td': { background: '#f5f7ff' } }}>
                                        <BodyCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <EventNoteIcon sx={{ fontSize: 16, color: '#7986cb' }} />
                                                <Typography sx={{ fontFamily: 'Georgia', fontWeight: 600, fontSize: '0.9rem' }}>
                                                    {subName}
                                                </Typography>
                                            </Box>
                                        </BodyCell>
                                        <BodyCell align="center">
                                            <Typography sx={{ fontFamily: 'Georgia', fontWeight: 700, color: '#2e7d32' }}>
                                                {present}
                                            </Typography>
                                        </BodyCell>
                                        <BodyCell align="center">
                                            <Typography sx={{ fontFamily: 'Georgia', color: '#78909c' }}>
                                                {sessions}
                                            </Typography>
                                        </BodyCell>
                                        <BodyCell>
                                            <ProgressBar variant="determinate" value={pct} />
                                        </BodyCell>
                                        <BodyCell align="center">
                                            <Chip
                                                label={`${pct}%`}
                                                size="small"
                                                sx={{
                                                    fontWeight: 700,
                                                    fontFamily: 'Georgia',
                                                    borderRadius: '8px',
                                                    background: pct >= 75 ? '#e8f5e9' : '#ffebee',
                                                    color: pct >= 75 ? '#2e7d32' : '#b71c1c',
                                                    fontSize: '0.78rem',
                                                }}
                                            />
                                        </BodyCell>
                                        <BodyCell align="center">
                                            <DetailsButton
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleOpen(subId)}
                                                endIcon={isOpen ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                                            >
                                                {isOpen ? 'Hide' : 'View'}
                                            </DetailsButton>
                                        </BodyCell>
                                    </StyledTableRow>

                                    {/* Expandable detail rows */}
                                    <StyledTableRow>
                                        <BodyCell colSpan={6} sx={{ p: 0, border: 'none !important' }}>
                                            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                                <Box sx={{ m: 2, background: '#f8f9ff', borderRadius: '12px', overflow: 'hidden' }}>
                                                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e8eaf6' }}>
                                                        <Typography sx={{ fontFamily: 'Georgia', fontWeight: 700, fontSize: '0.82rem', color: '#3949ab', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                                            Session Log — {subName}
                                                        </Typography>
                                                    </Box>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <StyledTableRow>
                                                                <BodyCell sx={{ fontWeight: 700, color: '#78909c !important', fontSize: '0.75rem !important', py: '10px !important' }}>Date</BodyCell>
                                                                <BodyCell sx={{ fontWeight: 700, color: '#78909c !important', fontSize: '0.75rem !important', py: '10px !important' }} align="right">Status</BodyCell>
                                                            </StyledTableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {allData.map((data, i) => {
                                                                const date = new Date(data.date);
                                                                const dateStr = date.toString() !== 'Invalid Date'
                                                                    ? date.toISOString().substring(0, 10)
                                                                    : 'Invalid Date';
                                                                const isPresent = data.status?.toLowerCase() === 'present';
                                                                return (
                                                                    <DetailRow key={i}>
                                                                        <BodyCell sx={{ fontSize: '0.82rem !important', py: '10px !important' }}>
                                                                            {dateStr}
                                                                        </BodyCell>
                                                                        <BodyCell align="right" sx={{ py: '10px !important' }}>
                                                                            <StatusChip
                                                                                label={data.status}
                                                                                sx={{
                                                                                    background: isPresent ? '#e8f5e9' : '#ffebee',
                                                                                    color: isPresent ? '#2e7d32' : '#b71c1c',
                                                                                }}
                                                                            />
                                                                        </BodyCell>
                                                                    </DetailRow>
                                                                );
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </BodyCell>
                                    </StyledTableRow>
                                </TableBody>
                            );
                        }
                    )}
                </Table>
            </TableCard>
        </Box>
    );

    /* ── Chart section ── */
    const renderChartSection = () => (
        <Box sx={{ background: '#fff', borderRadius: '20px', p: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
        </Box>
    );

    /* ── Main render ── */
    return (
        <PageWrapper>
            <Container maxWidth="md">
                <PageHeader>
                    <HeaderTitle>Attendance</HeaderTitle>
                    <HeaderSub>Track your presence across all subjects</HeaderSub>
                </PageHeader>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={6}>
                        <Typography sx={{ fontFamily: 'Georgia', color: '#7986cb' }}>Loading attendance…</Typography>
                    </Box>
                ) : subjectAttendance?.length > 0 ? (
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                        <BottomNav elevation={3}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                <BottomNavigationAction
                                    label="Table"
                                    value="table"
                                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                />
                                <BottomNavigationAction
                                    label="Chart"
                                    value="chart"
                                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                />
                            </BottomNavigation>
                        </BottomNav>
                    </>
                ) : (
                    <Box sx={{ background: '#fff', borderRadius: '20px', p: 5, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
                        <EventNoteIcon sx={{ fontSize: 48, color: '#c5cae9', mb: 2 }} />
                        <Typography sx={{ fontFamily: 'Georgia', color: '#7986cb', fontSize: '1rem' }}>
                            No attendance records found yet.
                        </Typography>
                    </Box>
                )}
            </Container>
        </PageWrapper>
    );
};

export default ViewStdAttendance;