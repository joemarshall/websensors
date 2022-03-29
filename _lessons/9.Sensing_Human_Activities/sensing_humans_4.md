---
title: 'The Sensing Body'
---
Many human activities involve the use of tools, or otherwise interacting with *things* in the world. For example we may play tennis with a racquet and balls, or clean with a vacuum cleaner. This highlights another way to sense human activity - rather than sense what the human is doing, sense what is happening to the things they interact with. Whilst this doesn't have the same richness that sensing the whole of the body has, it can also simplify things, because we only sense the interaction with the object which we are directly interested in, and don't have to worry about what is happening with the rest of the person's body. As with sensing moving bodies, we can do this both by sensing attached to the object, or by using external sensors to track motion of an object.

# Attached sensing

The most common way of sensing object interaction is to augment the object with accelerometers, gyroscopes or similar inertial measurement sensors. For example in sports research people have augmented things such as golf clubs ( [Hsu et al. 2016](#Hsu)) to understand what movements people are making with them. Similarly games controllers such as those on the Nintendo Switch contain accelerometers and gyroscopes, in part to enable them to be used as simulated objects in games. 

Other methods of object-based sensing include the use of strain gauges to detect forces applied to an object (this is commonly used in cycling pedal power sensors, but has also been used in other sporting devices), magnetic switches to detect rotation of wheels (used on bikes and other human-powered vehicles), sensing of object position using cameras on the object (this was used on Nintendo Wii Controllers, and is used by Oculus Quest headsets). 

{%include figure.html url="/images/joycon.jpg" alt="Nintendo Switch controllers" title="Nintendo Switch joycon controllers" caption="The Nintendo Switch Joycon controllers can sense orientation and gestures using accelerometers and gyroscopes." %}

# External tracking of object interaction

An alternative way of sensing objects is by using external sensors to track them. A really old example of this is the first work I did on my PhD quite a long time ago, using cameras to track juggling balls in order to augment circus performances ([Marshall 2007](#Marshall)). This used easily trackable bright coloured balls, which were much easier to track than the hands of the person juggling themselves. A more recent example of this approach is weightlifting tracking software which in addition to detecting the person's body pose and actions, also tracks the quantity of weights being lifted on the bar ([Kang 2018](#Kang)).

Beyond video tracking, there are also alternative approaches to detect object manipulation, for example the HTC Vive virtual reality headset uses a combination of scanning laser 'base stations' and receivers in the controllers to enable high accuracy detection of position and orientation of the controllers.

{%include figure.html url="/images/juggling.jpg" alt="Joe's Juggling Tracker" title="Tracking juggling with computer vision" caption="Joe's Juggling Tracker uses computer vision to track balls being juggled and overlay computer generated visuals." %}

# References

1. <a id="Hsu"></a> Hsu, Y.L., Chen, Y.T., Chou, P.H., Kou, Y.C., Chen, Y.C. and Su, H.Y., 2016, May. Golf swing motion detection using an inertial-sensor-based portable instrument. In <a href="https://doi.org/10.1109/ICCE-TW.2016.7521016">2016 IEEE international conference on consumer electronics-Taiwan (ICCE-TW) (pp. 1-2). IEEE.</a>
2. <a id="Marshall"></a>Marshall, J., Benford, S. and Pridmore, T., 2007, June. Eye-balls: juggling with the virtual. In <a href="https://doi.org/10.1145/1254960.1255005">Proceedings of the 6th ACM SIGCHI conference on Creativity & cognition (pp. 265-266).</a>
2. <a id="Kang"></a>Kang, J., Dworschak, A., Budzis, J., Killam, J., Dhande, R. and Cotsakis, R., 2018. <a href="https://justinkang221.github.io/files/ENPH_459_Project_Summary.pdf">Automated Fitness Tracking Using Machine Vision.</a>