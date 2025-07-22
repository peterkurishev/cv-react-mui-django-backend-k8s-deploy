import { Typography, Box } from '@mui/material';

interface AboutProps {
  content: string;
}

const About: React.FC<AboutProps> = ({ content }) => {
  return (
    <Box mb={4}>
      <Typography variant="h5">Обо мне</Typography>
      <Typography variant="body1" color="text.secondary">
        {content}
      </Typography>
    </Box>
  );
};

export default About;
