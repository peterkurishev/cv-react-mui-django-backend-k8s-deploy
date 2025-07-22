import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Container, Grid } from '@mui/material';
import About from './components/About';
import { Resume } from './types';

function App() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get<Resume>('https://cv.dswz.ru/api/message');
        setResume(res.data);
      } catch (error) {
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);


  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Мое резюме
      </Typography>
      <Grid container spacing={4}>
        <Grid>
          <About content={resume!.about} />
        </Grid>
        {/* <Grid item xs={12}> */}
        {/*   <Experience data={resume!.experience} /> */}
        {/* </Grid> */}
        {/* <Grid item xs={12}> */}
        {/*   <Education data={resume!.education} /> */}
        {/* </Grid> */}
        {/* <Grid item xs={12}> */}
        {/*   <Skills data={resume!.skills} /> */}
        {/* </Grid> */}
        {/* <Grid item xs={12}> */}
        {/*   <Contact data={resume!.contact} /> */}
        {/* </Grid> */}
      </Grid>
    </Container>
  );
};

export default App;
