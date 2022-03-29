---
title: 'The Relating Body'
---
The final aspect of human activities which we are interested in is ways in which humans interact with other humans, how they *relate* to each other physically. 

Human to human interaction involves a wide range of activities, from the activities of large scale crowds in public right down to 2 person physical contact. There is such a wide range of research in this field that in this section we will just describe a couple of the extremes of this kind of sensing. 

# Interpersonal Touch

In a project studying interpersonal touch, we built gaming systems to explore sensing of different aspects of interpersonal touch. In one development (<a href="#Marshall2016">Marshall 2016</a>) we explored sensing of collisions and forceful activity between people, by creating two games Balance of Power and Bundle Game which respectively used computer vision based sensing and smartphone sensing to sense moments of physical contact between players. The game Touch-o-matic (<a href="#Marshall2017">Marshall 2017</a>) was deliberately built to explore a contrasting mode of interpersonal touch; that of two people touching each other's skin delicately. It senses the resistance between the hands of two players to estimate the firmness of skin to skin contact between the players and uses this to drive a simple game. You can play Touch-o-Matic in the Computer Science downstairs corridor at Nottingham.

{%include figure.html url="/images/balance_of_power.jpg" alt="Balance of Power Game" title="Balance of Power" caption="In Balance of Power, players must get the other players to their side of the court using brute force and cunning." %}


# Crowd sensing

Sensing the behaviour of crowds is a very active research area, as detecting what crowds are doing or are going to do is seen as important for policing and management of public space. Often this work is focused on detecting when crowds are forming, what the emotional state of the crowd is (e.g. is it an angry mob, or peaceful), and in detecting abnormal behaviours of crowds (See Sanchez et al. ([2020](#Sanchez)) for a review of current work on this). This is typically done using computer vision techniques on CCTV images and video, although some work has demonstrated other ways of analysing crowds such as by sensing the numbers of mobile phones in an area using Bluetooth and Wifi scanning ([Schauer et al. 2014](#Schauer))

{%include figure.html url="/images/crowdsensing.jpg" alt="Detecting crowd density from images" title="Detecting crowd density from images" caption="This shows the use of computer vision based sensing to estimate the number and distribution of people in a large crowd (from Khan et al. <a href='#Khan'>(2021)</a> CC-BY 4.0)." %}


# References

1. <a id="Marshall2016"></a>Marshall, J., Linehan, C. and Hazzard, A., 2016, May. Designing brutal multiplayer video games. In <a href="https://doi.org/10.1145/2858036.2858080">Proceedings of the 2016 chi conference on human factors in computing systems (pp. 2669-2680).</a>
1. <a id="Marshall2017"></a>Marshall, J. and Tennent, P., 2017, June. Touchomatic: interpersonal touch gaming in the wild. In <a href="https://doi.org/10.1145/3064663.3064727">Proceedings of the 2017 Conference on Designing Interactive Systems (pp. 417-428).</a>
1. <a id="Sanchez"></a>Sánchez, F.L., Hupont, I., Tabik, S. and Herrera, F., 2020. Revisiting crowd behaviour analysis through deep learning: Taxonomy, anomaly detection, crowd emotions, datasets, opportunities and prospects. <a href="https://doi.org/10.1016/j.inffus.2020.07.008">Information Fusion, 64, pp.318-335.</a>
1. <a id="Schauer"></a>Schauer, L., Werner, M. and Marcus, P., 2014, December. Estimating crowd densities and pedestrian flows using wi-fi and bluetooth. In <a href="https://doi.org/10.4108/icst.mobiquitous.2014.257870">Proceedings of the 11th International Conference on Mobile and Ubiquitous Systems: Computing, Networking and Services (pp. 171-177).</a>
1. <a id="Khan"></a> Khan, S.D., Salih, Y., Zafar, B. and Noorwali, A., 2021. A Deep-Fusion Network for Crowd Counting in High-Density Crowded Scenes. <a href="https://doi.org/10.1007/s44196-021-00016-x">International Journal of Computational Intelligence Systems, 14(1), pp.1-12.</a>