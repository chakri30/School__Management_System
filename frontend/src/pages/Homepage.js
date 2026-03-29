import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import Students from "../assets/students.svg";

/* ─── Animations ──────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-14px); }
`;

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const blobPulse = keyframes`
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50%       { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
`;

/* ─── Layout ──────────────────────────────────────────────── */
const Page = styled.div`
  min-height: 100vh;
  background: #fafaf8;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  font-family: 'Cormorant Garamond', 'Garamond', 'Georgia', serif;
  position: relative;

  /* Subtle dot grid */
  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: radial-gradient(circle, #d4cfc8 1px, transparent 1px);
    background-size: 32px 32px;
    opacity: 0.45;
    pointer-events: none;
    z-index: 0;
  }
`;

/* ─── Left Panel ──────────────────────────────────────────── */
const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) { display: none; }
`;

const BlobBg = styled.div`
  position: absolute;
  width: 420px;
  height: 420px;
  background: linear-gradient(135deg, #e8e4f8 0%, #dff0ea 60%, #fde8d8 100%);
  animation: ${blobPulse} 8s ease-in-out infinite;
  opacity: 0.7;
  z-index: 0;
`;

const IllustrationWrap = styled.div`
  position: relative;
  z-index: 1;
  animation: ${float} 6s ease-in-out infinite;
  filter: drop-shadow(0 24px 48px rgba(0,0,0,0.10));

  img {
    width: 100%;
    max-width: 480px;
    height: auto;
  }
`;

const RotatingRing = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border: 1.5px dashed rgba(120, 100, 200, 0.18);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${spin} 30s linear infinite;
  z-index: 0;
`;

/* ─── Right Panel ─────────────────────────────────────────── */
const RightPanel = styled.div`
  width: 480px;
  flex-shrink: 0;
  background: #fff;
  border-left: 1px solid #ece9e3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 52px;
  position: relative;
  z-index: 1;
  box-shadow: -20px 0 60px rgba(0,0,0,0.04);

  @media (max-width: 768px) {
    width: 100%;
    padding: 48px 28px;
    border-left: none;
  }
`;

const TagLine = styled.span`
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: #8b7cf8;
  background: #f3f0ff;
  border: 1px solid #ddd6fe;
  border-radius: 20px;
  padding: 5px 16px;
  margin-bottom: 28px;
  animation: ${fadeUp} 0.5s ease both;
`;

const Title = styled.h1`
  font-size: 3.2rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.12;
  letter-spacing: -1px;
  margin: 0 0 20px;
  animation: ${fadeUp} 0.55s ease both;
  animation-delay: 0.08s;

  span {
    display: block;
    background: linear-gradient(90deg, #7c3aed, #a855f7, #7c3aed);
    background-size: 600px 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${shimmer} 3s linear infinite, ${fadeUp} 0.55s ease both;
    animation-delay: 0s, 0.08s;
  }
`;

const Description = styled.p`
  font-size: 1.05rem;
  color: #6b6b6b;
  line-height: 1.75;
  margin: 0 0 40px;
  font-family: 'Georgia', serif;
  animation: ${fadeUp} 0.6s ease both;
  animation-delay: 0.16s;
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e0f8, transparent);
  margin: 8px 0 36px;
  animation: ${fadeUp} 0.6s ease both;
  animation-delay: 0.2s;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: ${fadeUp} 0.65s ease both;
  animation-delay: 0.24s;
`;

const LoginBtn = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
  color: #fff;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 15px 28px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(124,58,237,0.30);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(124,58,237,0.42);
  }

  &:active { transform: translateY(0); }
`;

const SignupRow = styled.div`
  text-align: center;
  margin-top: 28px;
  font-size: 0.9rem;
  color: #9ca3af;
  font-family: 'Georgia', serif;
  animation: ${fadeUp} 0.7s ease both;
  animation-delay: 0.32s;

  a {
    color: #7c3aed;
    font-weight: 700;
    text-decoration: none;
    border-bottom: 1px solid rgba(124,58,237,0.3);
    padding-bottom: 1px;
    transition: border-color 0.2s;

    &:hover { border-color: #7c3aed; }
  }
`;

/* Feature pills */
const FeatureRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 36px;
  animation: ${fadeUp} 0.62s ease both;
  animation-delay: 0.2s;
`;

const FeaturePill = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fafafa;
  border: 1px solid #ece9e3;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 0.78rem;
  color: #4b5563;
  font-family: 'Georgia', serif;

  &::before {
    content: '✦';
    color: #8b7cf8;
    font-size: 10px;
  }
`;

/* Corner decoration */
const CornerDot = styled.div`
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%);
  top: -40px;
  right: -40px;
`;

const BottomDot = styled.div`
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%);
  bottom: 30px;
  left: -30px;
`;

/* ─── Component ───────────────────────────────────────────── */
const Homepage = () => {
    return (
        <Page>
            {/* Left — illustration */}
            <LeftPanel>
                <BlobBg />
                <RotatingRing />
                <IllustrationWrap>
                    <img src={Students} alt="students collaborating" />
                </IllustrationWrap>
            </LeftPanel>

            {/* Right — content */}
            <RightPanel>
                <CornerDot />
                <BottomDot />

                <TagLine>School Management System</TagLine>

                <Title>
                    Education,
                    <span>Organised.</span>
                </Title>

                <Description>
                    Streamline classes, track attendance, assess performance,
                    and keep every stakeholder connected — all in one place.
                </Description>

                <FeatureRow>
                    <FeaturePill>Attendance Tracking</FeaturePill>
                    <FeaturePill>Exam Results</FeaturePill>
                    <FeaturePill>Class Management</FeaturePill>
                    <FeaturePill>Notices & Updates</FeaturePill>
                </FeatureRow>

                <Divider />

                <ButtonGroup>
                    <LoginBtn to="/choose">
                        Login to your account →
                    </LoginBtn>
                </ButtonGroup>

                <SignupRow>
                    New school?{' '}
                    <Link to="/Adminregister">Register as Admin</Link>
                </SignupRow>
            </RightPanel>
        </Page>
    );
};

export default Homepage;