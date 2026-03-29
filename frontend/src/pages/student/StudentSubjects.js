import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import {
    BottomNavigation, BottomNavigationAction, Box,
    Chip, Container, Paper, Table, TableBody,
    TableHead, Typography
} from '@mui/material';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuBookIcon from '@mui/icons-material/MenuBook';

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
  letter-spacing: 0.5px !important;
`;

const StatsRow = styled(Box)`
  display: flex;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

const StatCard = styled(Box)`
  flex: 1;
  min-width: 140px;
  background: #fff;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  animation: ${fadeUp} 0.5s ease both;
  animation-delay: ${({ delay }) => delay || '0s'};
  opacity: 0;
  animation-fill-mode: forwards;
  border-left: 4px solid ${({ accent }) => accent || '#3f51b5'};
`;

const StatValue = styled(Typography)`
  font-family: 'Georgia', serif !important;
  font-size: 2rem !important;
  font-weight: 700 !important;
  color: ${({ color }) => color || '#1a237e'} !important;
  line-height: 1 !important;
  margin-bottom: 4px !important;
`;

const StatLabel = styled(Typography)`
  font-size: 0.75rem !important;
  color: #9e9e9e !important;
  font-weight: 600 !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
`;

const TableCard = styled(Box)`
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  animation: ${fadeUp} 0.5s ease 0.2s both;
`;

const TableHeaderCell = styled(StyledTableCell)`
  background: linear-gradient(135deg, #1a237e, #283593) !important;
  color: #fff !important;
  font-family: 'Georgia', serif !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  font-size: 0.82rem !important;
  padding: 16px 20px !important;
  border: none !important;
`;

const BodyRow = styled(StyledTableRow)`
  transition: background 0.2s !important;
  &:hover td { background: #f5f7ff !important; }
`;

const BodyCell = styled(StyledTableCell)`
  font-family: 'Georgia', serif !important;
  padding: 16px 20px !important;
  color: #37474f !important;
  border-bottom: 1px solid #f0f4f8 !important;
`;

const ScoreChip = styled(Chip)`
  font-weight: 700 !important;
  font-family: 'Georgia', serif !important;
  font-size: 0.85rem !important;
  border-radius: 8px !important;
  min-width: 60px !important;
`;

const BottomNav = styled(Paper)`
  position: fixed !important;
  bottom: 0; left: 0; right: 0;
  z-index: 1000;
  border-top: 1px solid #e8eaf6 !important;
  box-shadow: 0 -4px 24px rgba(26,35,126,0.1) !important;
`;

const ClassDetailsBox = styled(Box)`
  background: #fff;
  border-radius: 20px;
  padding: 36px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  animation: ${fadeUp} 0.5s ease both;
`;

const SubjectPill = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 12px;
  background: #f0f4f8;
  margin-bottom: 10px;
  transition: all 0.2s;

  &:hover {
    background: #e8eaf6;
    transform: translateX(4px);
  }
`;

/* ─── Score colour helper ─────────────────────────────────── */
const scoreColor = (marks) => {
    if (marks >= 80) return { bg: '#e8f5e9', color: '#2e7d32', label: 'A' };
    if (marks >= 60) return { bg: '#e3f2fd', color: '#1565c0', label: 'B' };
    if (marks >= 40) return { bg: '#fff3e0', color: '#e65100', label: 'C' };
    return { bg: '#ffebee', color: '#b71c1c', label: 'D' };
};

/* ─── Component ───────────────────────────────────────────── */
const StudentSubjects = () => {
    const dispatch = useDispatch();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading } = useSelector((state) => state.user);

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, 'Student'));
    }, [dispatch, currentUser._id]);

    useEffect(() => {
        if (userDetails) setSubjectMarks(userDetails.examResult || []);
    }, [userDetails]);

    useEffect(() => {
        if (!subjectMarks.length) {
            dispatch(getSubjectList(currentUser.sclassName._id, 'ClassSubjects'));
        }
    }, [subjectMarks, dispatch, currentUser.sclassName._id]);

    const handleSectionChange = (_, v) => setSelectedSection(v);

    /* summary stats */
    const validMarks = subjectMarks.filter((r) => r.subName && r.marksObtained !== undefined);
    const total = validMarks.length;
    const avg = total ? (validMarks.reduce((s, r) => s + r.marksObtained, 0) / total).toFixed(1) : '—';
    const highest = total ? Math.max(...validMarks.map((r) => r.marksObtained)) : '—';

    /* ── Render table ── */
    const renderTableSection = () => (
        <Box>
            <StatsRow>
                <StatCard accent="#3f51b5" delay="0s">
                    <StatValue>{total}</StatValue>
                    <StatLabel>Subjects</StatLabel>
                </StatCard>
                <StatCard accent="#43a047" delay="0.08s">
                    <StatValue color="#2e7d32">{avg}</StatValue>
                    <StatLabel>Avg. Marks</StatLabel>
                </StatCard>
                <StatCard accent="#fb8c00" delay="0.16s">
                    <StatValue color="#e65100">{highest}</StatValue>
                    <StatLabel>Highest Score</StatLabel>
                </StatCard>
            </StatsRow>

            <TableCard>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <TableHeaderCell>#</TableHeaderCell>
                            <TableHeaderCell>Subject</TableHeaderCell>
                            <TableHeaderCell align="center">Marks</TableHeaderCell>
                            <TableHeaderCell align="center">Grade</TableHeaderCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {validMarks.map((result, index) => {
                            const { bg, color, label } = scoreColor(result.marksObtained);
                            return (
                                <BodyRow key={index}>
                                    <BodyCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>{index + 1}</BodyCell>
                                    <BodyCell>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <MenuBookIcon sx={{ fontSize: 16, color: '#7986cb' }} />
                                            {result.subName.subName}
                                        </Box>
                                    </BodyCell>
                                    <BodyCell align="center">
                                        <Typography sx={{ fontFamily: 'Georgia', fontWeight: 700, color: '#1a237e', fontSize: '1rem' }}>
                                            {result.marksObtained}
                                        </Typography>
                                    </BodyCell>
                                    <BodyCell align="center">
                                        <ScoreChip label={label} size="small" sx={{ background: bg, color: color }} />
                                    </BodyCell>
                                </BodyRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableCard>
        </Box>
    );

    /* ── Render chart ── */
    const renderChartSection = () => (
        <Box sx={{ background: '#fff', borderRadius: '20px', p: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
        </Box>
    );

    /* ── Class details (no marks yet) ── */
    const renderClassDetailsSection = () => (
        <ClassDetailsBox>
            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <EmojiEventsIcon sx={{ color: '#ffa000', fontSize: 32 }} />
                <Box>
                    <Typography sx={{ fontFamily: 'Georgia', fontWeight: 700, color: '#1a237e', fontSize: '1.3rem' }}>
                        Class {sclassDetails?.sclassName}
                    </Typography>
                    <Typography sx={{ color: '#9e9e9e', fontSize: '0.82rem' }}>Your enrolled subjects</Typography>
                </Box>
            </Box>

            {subjectsList?.map((subject, index) => (
                <SubjectPill key={index}>
                    <MenuBookIcon sx={{ color: '#7986cb', fontSize: 18 }} />
                    <Box>
                        <Typography sx={{ fontFamily: 'Georgia', fontWeight: 600, color: '#37474f', fontSize: '0.9rem' }}>
                            {subject.subName}
                        </Typography>
                        <Typography sx={{ color: '#bdbdbd', fontSize: '0.75rem' }}>Code: {subject.subCode}</Typography>
                    </Box>
                </SubjectPill>
            ))}
        </ClassDetailsBox>
    );

    /* ── Main render ── */
    return (
        <PageWrapper>
            <Container maxWidth="md">
                <PageHeader>
                    <HeaderTitle>Academic Performance</HeaderTitle>
                    <HeaderSub>Subject Marks & Progress Overview</HeaderSub>
                </PageHeader>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={6}>
                        <Typography sx={{ fontFamily: 'Georgia', color: '#7986cb' }}>Loading your results…</Typography>
                    </Box>
                ) : (
                    <>
                        {subjectMarks?.length > 0 ? (
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
                            renderClassDetailsSection()
                        )}
                    </>
                )}
            </Container>
        </PageWrapper>
    );
};

export default StudentSubjects;