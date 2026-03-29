import React, { useEffect, useState } from 'react';
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Tab, CircularProgress, BottomNavigation,
  BottomNavigationAction, Paper
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookIcon from '@mui/icons-material/Book';
import ClassIcon from '@mui/icons-material/Class';
import PersonIcon from '@mui/icons-material/Person';
import TimerIcon from '@mui/icons-material/Timer';
import CodeIcon from '@mui/icons-material/Code';
import TableChartIcon from '@mui/icons-material/TableChart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import AddIcon from '@mui/icons-material/Add';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ViewSubject = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass);

  const { classID, subjectID } = params;
  const [value, setValue] = useState('1');
  const [selectedSection, setSelectedSection] = useState('attendance');

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  if (subloading) return (
    <LoadingWrapper>
      <CircularProgress sx={{ color: '#4facfe' }} />
      <LoadingText>Loading subject details...</LoadingText>
    </LoadingWrapper>
  );

  const studentColumns = [
    { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
  ];

  const studentRows = sclassStudents.map((student) => ({
    rollNum: student.rollNum,
    name: student.name,
    id: student._id,
  }));

  const StudentsAttendanceButtonHaver = ({ row }) => (
    <>
      <BlueButton variant="contained" size="small"
        onClick={() => navigate("/Admin/students/student/" + row.id)}>
        View
      </BlueButton>
      <PurpleButton variant="contained" size="small"
        onClick={() => navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)}>
        Attendance
      </PurpleButton>
    </>
  );

  const StudentsMarksButtonHaver = ({ row }) => (
    <>
      <BlueButton variant="contained" size="small"
        onClick={() => navigate("/Admin/students/student/" + row.id)}>
        View
      </BlueButton>
      <PurpleButton variant="contained" size="small"
        onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}>
        Marks
      </PurpleButton>
    </>
  );

  const infoCards = [
    { icon: <CodeIcon sx={{ fontSize: 20 }} />, label: 'Subject Code', value: subjectDetails?.subCode, color: '#667eea' },
    { icon: <TimerIcon sx={{ fontSize: 20 }} />, label: 'Sessions', value: subjectDetails?.sessions, color: '#43e97b' },
    { icon: <ClassIcon sx={{ fontSize: 20 }} />, label: 'Class', value: subjectDetails?.sclassName?.sclassName, color: '#4facfe' },
    { icon: <PersonIcon sx={{ fontSize: 20 }} />, label: 'Students', value: sclassStudents.length, color: '#f5576c' },
  ];

  return (
    <PageWrapper>
      <BackBtn onClick={() => navigate(-1)}>
        <ArrowBackIcon sx={{ fontSize: 18, mr: 0.5 }} /> Back
      </BackBtn>

      {/* Subject Header */}
      <SubjectHeader>
        <SubjectIconBox>
          <BookIcon sx={{ fontSize: 32, color: 'white' }} />
        </SubjectIconBox>
        <SubjectInfo>
          <SubjectName>{subjectDetails?.subName}</SubjectName>
          <SubjectMeta>
            <MetaChip>{subjectDetails?.subCode}</MetaChip>
            <MetaChip>{subjectDetails?.sclassName?.sclassName}</MetaChip>
          </SubjectMeta>
        </SubjectInfo>
      </SubjectHeader>

      {/* Info Cards */}
      <InfoGrid>
        {infoCards.map((card, index) => (
          <InfoCard key={index} color={card.color} delay={index * 0.08}>
            <InfoIconBox color={card.color}>{card.icon}</InfoIconBox>
            <InfoContent>
              <InfoLabel>{card.label}</InfoLabel>
              <InfoValue>{card.value || 'N/A'}</InfoValue>
            </InfoContent>
          </InfoCard>
        ))}
      </InfoGrid>

      {/* Teacher Info */}
      <TeacherCard>
        <PersonIcon sx={{ color: '#764ba2', mr: 1.5, fontSize: 22 }} />
        {subjectDetails?.teacher ? (
          <TeacherInfo>
            <TeacherLabel>Assigned Teacher</TeacherLabel>
            <TeacherName>{subjectDetails.teacher.name}</TeacherName>
          </TeacherInfo>
        ) : (
          <TeacherInfo>
            <TeacherLabel>No teacher assigned</TeacherLabel>
            <AssignBtn
              onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails?._id)}
            >
              <AddIcon sx={{ fontSize: 16, mr: 0.5 }} /> Assign Teacher
            </AssignBtn>
          </TeacherInfo>
        )}
      </TeacherCard>

      {/* Students Tabs */}
      <StudentsCard>
        <TabContext value={value}>
          <TabList
            onChange={(e, v) => setValue(v)}
            sx={{
              borderBottom: '2px solid #f0f2f5',
              '& .MuiTab-root': { fontWeight: 700, textTransform: 'none' },
              '& .Mui-selected': { color: '#4facfe' },
              '& .MuiTabs-indicator': { backgroundColor: '#4facfe', height: 3, borderRadius: 2 },
            }}
          >
            <Tab label="📋 Details" value="1" />
            <Tab label="👨‍🎓 Students" value="2" />
          </TabList>

          <TabPanel value="1" sx={{ px: 0 }}>
            <DetailsList>
              <DetailRow>
                <DetailLabel>Subject Name</DetailLabel>
                <DetailValue>{subjectDetails?.subName}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Subject Code</DetailLabel>
                <DetailValue>{subjectDetails?.subCode}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Total Sessions</DetailLabel>
                <DetailValue>{subjectDetails?.sessions}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Class</DetailLabel>
                <DetailValue>{subjectDetails?.sclassName?.sclassName}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Teacher</DetailLabel>
                <DetailValue>{subjectDetails?.teacher?.name || 'Not Assigned'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Total Students</DetailLabel>
                <DetailValue>{sclassStudents.length}</DetailValue>
              </DetailRow>
            </DetailsList>
          </TabPanel>

          <TabPanel value="2" sx={{ px: 0, pb: 8 }}>
            {getresponse ? (
              <EmptyState>
                <EmptyIcon>👨‍🎓</EmptyIcon>
                <EmptyText>No students in this class yet</EmptyText>
                <GreenButton variant="contained"
                  onClick={() => navigate("/Admin/class/addstudents/" + classID)}>
                  Add Students
                </GreenButton>
              </EmptyState>
            ) : (
              <>
                {selectedSection === 'attendance' &&
                  <TableTemplate
                    buttonHaver={StudentsAttendanceButtonHaver}
                    columns={studentColumns}
                    rows={studentRows}
                  />
                }
                {selectedSection === 'marks' &&
                  <TableTemplate
                    buttonHaver={StudentsMarksButtonHaver}
                    columns={studentColumns}
                    rows={studentRows}
                  />
                }
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                  <BottomNavigation
                    value={selectedSection}
                    onChange={(e, v) => setSelectedSection(v)}
                    showLabels
                  >
                    <BottomNavigationAction
                      label="Attendance"
                      value="attendance"
                      icon={selectedSection === 'attendance' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                    />
                    <BottomNavigationAction
                      label="Marks"
                      value="marks"
                      icon={selectedSection === 'marks' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                    />
                  </BottomNavigation>
                </Paper>
              </>
            )}
          </TabPanel>
        </TabContext>
      </StudentsCard>
    </PageWrapper>
  );
};

export default ViewSubject;

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
    color: #4facfe;
    border: 2px solid #4facfe22;
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 20px;
    transition: all 0.2s;

    &:hover { background: #4facfe; color: white; }
`;

const SubjectHeader = styled.div`
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 20px;
    padding: 28px 32px;
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    box-shadow: 0 8px 30px rgba(79,172,254,0.4);
    animation: ${fadeUp} 0.5s ease forwards;
`;

const SubjectIconBox = styled.div`
    width: 70px;
    height: 70px;
    border-radius: 18px;
    background: rgba(255,255,255,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 2px solid rgba(255,255,255,0.4);
`;

const SubjectInfo = styled.div`flex: 1;`;

const SubjectName = styled.h2`
    color: white;
    font-size: 1.6rem;
    font-weight: 800;
    margin: 0 0 10px 0;
`;

const SubjectMeta = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

const MetaChip = styled.span`
    background: rgba(255,255,255,0.25);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    border: 1px solid rgba(255,255,255,0.3);
`;

const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 14px;
    margin-bottom: 20px;
    animation: ${fadeUp} 0.5s ease 0.1s both;
`;

const InfoCard = styled.div`
    background: white;
    border-radius: 14px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border-left: 4px solid ${props => props.color};
    animation: ${fadeUp} 0.4s ease ${props => props.delay || 0}s both;
`;

const InfoIconBox = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: ${props => props.color}22;
    color: ${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const InfoContent = styled.div``;

const InfoLabel = styled.div`
    font-size: 0.7rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
    font-size: 0.95rem;
    font-weight: 700;
    color: #1a1a2e;
`;

const TeacherCard = styled.div`
    background: white;
    border-radius: 16px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border-left: 4px solid #764ba2;
    animation: ${fadeUp} 0.5s ease 0.2s both;
`;

const TeacherInfo = styled.div`flex: 1;`;

const TeacherLabel = styled.div`
    font-size: 0.75rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
`;

const TeacherName = styled.div`
    font-size: 1rem;
    font-weight: 700;
    color: #1a1a2e;
`;

const AssignBtn = styled.button`
    display: inline-flex;
    align-items: center;
    background: linear-gradient(135deg, #764ba2, #f5576c);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 4px;
    transition: all 0.2s;

    &:hover { opacity: 0.9; transform: translateY(-1px); }
`;

const StudentsCard = styled.div`
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    animation: ${fadeUp} 0.5s ease 0.3s both;
`;

const DetailsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-top: 8px;
`;

const DetailRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid #f5f5f5;

    &:last-child { border-bottom: none; }
`;

const DetailLabel = styled.span`
    font-size: 0.85rem;
    color: #888;
    font-weight: 500;
`;

const DetailValue = styled.span`
    font-size: 0.9rem;
    font-weight: 700;
    color: #1a1a2e;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 50px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
`;

const EmptyIcon = styled.div`font-size: 3rem;`;
const EmptyText = styled.p`color: #aaa; font-size: 1rem; margin: 0;`;