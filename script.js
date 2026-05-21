const { createApp } = Vue;

        createApp({
            data() {
                return {
                    daysOfWeek: ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'],
                    currentDay: "Понеділок",
                    isEditing: false,

                    schedule: {
                        "Понеділок": [
                            { id: 1, num: "I", time: "8:00 - 9:20", name: "", teacher: "", room: "", type: "лекція", link: "" },
                        ],
                        "Вівторок": [
                            { id: 2, num: "I", time: "8:00 - 9:20", name: "", teacher: "", room: "", type: "лекція", link: "" },
                        ],
                        "Середа": [
                            { id: 3, num: "I", time: "8:00 - 9:20", name: "", teacher: "", room: "", type: "лекція", link: "" },
                        ],
                        "Четвер": [
                            { id: 4, num: "I", time: "8:00 - 9:20", name: "", teacher: "", room: "", type: "лекція", link: "" },
                        ],
                        "П'ятниця": [
                            { id: 5, num: "I", time: "8:00 - 9:20", name: "", teacher: "", room: "", type: "лекція", link: ""}
                        ],
                        "Субота": [
                            { id: 6, num: "I", time: "8:00 - 9:20", name: "", teacher: "", room: "", type: "лекція", link: ""}
                        ]
                    }
                };
            },
            computed: {
                currentSchedule() {
                    return this.schedule[this.currentDay] || [];
                }
            },
            methods: {
                addPairSlot() {
                    const currentDayList = this.schedule[this.currentDay];

                    const nextNum = currentDayList.length + 1;
                    
                    currentDayList.push({
                        id: Date.now() + Math.random(),
                        num: nextNum.toString(),
                        time: "19:00 - 20:20",
                        name: "",
                        teacher: "",
                        room: "",
                        type: "лекція",
                        link: ""
                    });
                },

                removePairSlot(index) {
                    if (confirm("Ви впевнені, що хочете видалити цей таймслот з розкладу?")) {
                        this.schedule[this.currentDay].splice(index, 1);
                    }
                },

                exportSchedule() {
                    const dataStr = JSON.stringify(this.schedule, null, 2);

                    const blob = new Blob([dataStr], { type: "application/json" });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = "my-schedule.json";
                    a.click();
                    
                    URL.revokeObjectURL(url);
                },

                triggerImport() {
                    this.$refs.fileInput.click();
                },

                importSchedule(event) {
                    const file = event.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();

                    reader.onload = (e) => {
                        try {
                            const importedData = JSON.parse(e.target.result);

                            if (typeof importedData === 'object' && importedData !== null) {
                                this.schedule = importedData;
                                alert("Розклад успішно оновлено!");
                            }
                        } catch (error) {
                            alert("Помилка! Переконайтеся, що ви завантажуєте правильний .json файл.");
                        }
                        event.target.value = '';
                    };

                    reader.readAsText(file);
                }
            },
            watch: {
                schedule: {
                    handler(newVal) {
                        localStorage.setItem('my-uni-schedule-v3', JSON.stringify(newVal));
                    },
                    deep: true
                }
            },
            mounted() {
                const savedData = localStorage.getItem('my-uni-schedule-v3');
                if (savedData) {
                    try {
                        this.schedule = JSON.parse(savedData);
                    } catch (e) {
                        console.error("Помилка відновлення даних");
                    }
                }

                const jsDay = new Date().getDay(); 
                if (jsDay >= 1 && jsDay <= 6) {
                    this.currentDay = this.daysOfWeek[jsDay - 1];
                } else {
                    this.currentDay = 'Понеділок';
                }
            }
        }).mount('#app');