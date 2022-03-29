---
title: 'The Moving Body'
---
Many sensing technology applications involved the use of sensors to interpret what someone is doing with their body. This can be done using body worn technology, or by using external sensors to track body motion.

This section describes three key applications, posture sensing, gesture sensing, and activity recognition. Each tracks human motion at different levels of abstraction and using quite different methods.

# Posture

Many applications aim to sense the posture of the human body or parts of it. For example in motion capture applications, we can capture the motion of the human body to drive the motion of animated characters, or in sports applications we may wish to know biomechanical details of how a sportsperson is moving, to aid training. Virtual reality headsets typically track the posture of the user's head and hands or handheld controllers to allow the position of the user to be replicated in a virtual environment.

Posture tracking may be done in many ways. Traditionally full body motion capture was done using complex systems of markers attached to the person's body, and external cameras or other sensors around a room to detect the location of each marker. These systems were extremely expensive, and only worked in fixed, controlled spaces. More recently two  innovations have changed this. Firstly 'markerless' motion capture uses video cameras to track human motion without requiring markers. This can be done either with depth sensing cameras such as Microsoft kinect, or by using advanced machine learning algorithms on standard cameras - for example Google's Blazepose ([Bazarevsky et al. 2020](#Bazarevsky)) enables tracking of complex sports movements such as yoga poses, using the camera on a standard smartphone. The second advance is the creation of inertial measurement (IMU) based motion capture systems. In these systems people wear either multiple strap on sensor nodes, or suits covered in sensors. Each sensor node contains accelerometers, gyroscopes and magnetometers; by using every node's data in combination it is possible to accurately estimate the full body pose. This enables full body motion tracking in any place, without the constraints of having to ensure users are in camera range. See McGrath et al. ([2020](#McGrath)) for a review of methods of doing this.

{%include figure.html url="/images/rokoko.jpg" alt="Smartsuit motion capture suit" title="Rokoko Smartsuit" caption="The Rokoko Smartsuit enables motion capture to be performed outside the studio." %}


# Gesture

Detecting user gestures is a very common use of sensors in practice. Whilst conceptually it is a subset of posture recognition, in practice it is often done using far simpler sensing, as we often do not need to know much detail about gestures. For example smartphones make use of accelerometers to detect gestures such as shaking or tapping on the screen. These applications require only simple processing of the raw accelerometer data; whilst we could use a pose sensing system to track them, in practice it is far more efficient to use more constrained interfaces. For example laptop touchpads can typically sense multiple swipe gestures; sensing these using a relatively simple and cheap capacitive sensor in a touchpad is more effective than more complex body sensing.

# Activity tracking and recognition

At a higher level of abstraction, we can use sensors to detect types and amounts of human activity. At its most basic this can be things like estimating the number of steps someone is taking by processing accelerometer data. More complex sensor processing can be used to infer what activity someone is doing, for example Google fit uses smartphone sensors to automatically detect whether someone is cycling, walking or running and to estimate how far they have gone in each activity. More recently some apps have even started to focus on quality of movement - typically using smartphone cameras to track how people are doing exercises such as squats or lifts.

Much recent activity recognition work focuses on use of deep learning applied to either accelerometer and gyroscope data from smartphones, or the analysis of activity from video data. A good survey of academic work in this area is available at [machinelearningmastery.com](https://machinelearningmastery.com/deep-learning-models-for-human-activity-recognition/)

{%include figure.html url="/images/qualityofmovement.jpg" alt="Motion tracking of squatting" title="Motion capture for quality of movement analysis" caption="Modern fitness apps can analyse quality as well as quantity of movements performed." %}


# References

1. <a id="Bazarevsky"></a>Bazarevsky, V., Grishchenko, I., Raveendran, K., Zhu, T., Zhang, F. and Grundmann, M., 2020. Blazepose: On-device real-time body pose tracking. <a href="https://doi.org/10.48550/arXiv.2006.10204">arXiv preprint arXiv:2006.10204.</a>
1. <a id="McGrath"></a>McGrath, T. and Stirling, L., 2020. Body-worn IMU human skeletal pose estimation using a factor graph-based optimization framework. <a href="https://doi.org/10.3390/s20236887">Sensors, 20(23), p.6887.</a>
